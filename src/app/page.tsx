"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ChatInput } from "@/components/chat/ChatInput";
import { useAuthStore } from "@/stores/authStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAgentStore } from "@/stores/agentStore";
import Image from "next/image";
import { useWsStore } from "@/stores/wsStore";
import type { MessageHandler } from "@/stores/wsStore";
import {
  AGENT_PROFILES,
  AGENT_PROFILES_BY_ID,
  AGENT_PROFILES_BY_TITLE,
  DEFAULT_AGENT,
} from "@/data/agents";

const agentMeta = AGENT_PROFILES_BY_TITLE;
const LANDING_KAI_MESSAGE =
  "I’m Teacher KAI, here to guide you today. Ask me your questions, or choose your mentor above: Principal Aralyn for lesson guidance, Tallya for quizzes, or Kuya Revi for step-by-step review tips. Let’s get learning!";

const FALLBACK_ERROR_MESSAGE = "Sorry, I am having trouble processing your request.";

let clientMessageSequence = 0;
const createMessageId = () => {
  clientMessageSequence += 1;
  return Date.now() + clientMessageSequence;
};

const readFileAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }
      const [, base64Payload] = result.split(",");
      resolve(base64Payload ?? result);
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });

type ChatBubble = {
  id: number;
  role: "user" | "assistant";
  content: string;
  agentId?: string;
  isStreaming?: boolean;
};

const LoadingDots = () => (
  <span className="flex items-center gap-1">
    <span className="h-2.5 w-2.5 rounded-full bg-current opacity-80 animate-bounce" style={{ animationDelay: "-0.24s" }} />
    <span className="h-2.5 w-2.5 rounded-full bg-current opacity-80 animate-bounce" style={{ animationDelay: "-0.12s" }} />
    <span className="h-2.5 w-2.5 rounded-full bg-current opacity-80 animate-bounce" />
  </span>
);

export default function Home() {
  const { userDetails } = useAuthStore();
  const userName = userDetails?.given_name || userDetails?.family_name;
  const { setActiveAgent, activeAgent } = useAgentStore();
  const { connect, send, addSessionListener, removeSessionListener, addGlobalListener, removeGlobalListener, isConnected } = useWsStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [hasSessionStarted, setHasSessionStarted] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: 1,
      role: "assistant",
      content: LANDING_KAI_MESSAGE,
      agentId: DEFAULT_AGENT.id,
    },
  ]);

  const agentProfiles = AGENT_PROFILES;
  const currentAgent = activeAgent || DEFAULT_AGENT;
  const previousAgentIdRef = useRef<string | undefined>(undefined);
  const pendingOptionsRef = useRef<{ useLandingMessage?: boolean; forceChatVisible?: boolean } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(sessionId);
  const assistantResponseBufferRef = useRef<string>("");
  const isStreamingRef = useRef(false);
  const lastMessageIdRef = useRef<number>(messages[messages.length - 1]?.id ?? Date.now());

  // # Ensure socket connects immediately on mount so the first message isn't queued
  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  const landingMentors = useMemo(
    () => Object.values(agentProfiles),
    [agentProfiles],
  );

  const greetingLabel = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const ensureSessionStarted = () => {
    if (!hasSessionStarted) {
      setHasSessionStarted(true);
      syncAssistantIntro(DEFAULT_AGENT, DEFAULT_AGENT.content);
      if (!isConnected) {
        connect();
      }
    }
  };

  const syncAssistantIntro = (
    agent: (typeof AGENT_PROFILES)[keyof typeof AGENT_PROFILES] | typeof DEFAULT_AGENT,
    overrideContent?: string,
  ) => {
    const contentToUse = overrideContent ?? agent.content;
    setMessages((prev) => {
      const next = [...prev];
      if (next.length === 0 || next[0]?.role !== "assistant") {
        next.unshift({
          id: Date.now(),
          role: "assistant",
          content: contentToUse,
          agentId: agent.id,
        });
      } else {
        next[0] = { ...next[0], content: contentToUse, agentId: agent.id };
      }
      return next;
    });
  };

  const applyAgentSelection = (
    agent: typeof DEFAULT_AGENT | (typeof AGENT_PROFILES)[keyof typeof AGENT_PROFILES],
    options?: { useLandingMessage?: boolean; forceChatVisible?: boolean },
  ) => {
    const shouldShowLanding = options?.forceChatVisible
      ? false
      : options?.useLandingMessage ?? (!hasSessionStarted && agent.id === DEFAULT_AGENT.id);

    if (shouldShowLanding) {
      setHasSessionStarted(false);
      setSelectedAgentId(null);
      setIsChatVisible(false);
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          content: LANDING_KAI_MESSAGE,
          agentId: agent.id,
        },
      ]);
      return;
    }

    setHasSessionStarted(true);
    setIsChatVisible(true);
    setSelectedAgentId(agent.id);
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: agent.content,
        agentId: agent.id,
      },
    ]);
    // Reset any buffered assistant output for the new visible chat
    assistantResponseBufferRef.current = "";
  };

  useEffect(() => {
    if (!activeAgent) return;

    const pendingOptions = pendingOptionsRef.current;
    const isSameAgent = previousAgentIdRef.current === activeAgent.id;

    if (isSameAgent && !pendingOptions) {
      return;
    }

    previousAgentIdRef.current = activeAgent.id;
    pendingOptionsRef.current = null;

    const shouldUseLandingCopy = pendingOptions?.forceChatVisible
      ? false
      : pendingOptions?.useLandingMessage ?? (!hasSessionStarted && activeAgent.id === DEFAULT_AGENT.id);

    applyAgentSelection(activeAgent ?? DEFAULT_AGENT, {
      useLandingMessage: shouldUseLandingCopy,
      forceChatVisible: pendingOptions?.forceChatVisible,
    });
  }, [activeAgent, hasSessionStarted]);

  const propagateMessages = (nextMessages: typeof messages) => {
    setMessages(nextMessages);
  };

  const upsertAssistantBubble = useCallback(
    (partial: { id: number; agentId: string; content: string; isFinal?: boolean }) => {
      setMessages((prev) => {
        const existingIndex = prev.findIndex((entry) => entry.id === partial.id);
        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            content: partial.content,
            agentId: partial.agentId,
            isStreaming: !partial.isFinal,
          };
          return next;
        }
        return [
          ...prev,
          {
            id: partial.id,
            role: "assistant",
            content: partial.content,
            agentId: partial.agentId,
            isStreaming: !partial.isFinal,
          },
        ];
      });
      if (partial.isFinal) {
        assistantResponseBufferRef.current = "";
        isStreamingRef.current = false;
      }
    },
    [],
  );

  const handleWsMessage = useCallback<MessageHandler>(
    (data) => {
      const incomingSessionId = (data as { session_id?: string }).session_id;
      if (incomingSessionId && sessionIdRef.current && incomingSessionId !== sessionIdRef.current) {
        return;
      }
    const assistantMeta =
      selectedAgentId && Object.values(agentProfiles).find((meta) => meta.id === selectedAgentId)
        ? (Object.values(agentProfiles).find((meta) => meta.id === selectedAgentId) as (typeof agentProfiles)[keyof typeof agentProfiles])
        : DEFAULT_AGENT;
      const assistantId = assistantMeta.id;
      // Handle context payload from backend to capture session_id
      if ("chat_messages" in data && "session_id" in data) {
        if (!sessionIdRef.current && typeof data.session_id === "string") {
          setSessionId(data.session_id);
          sessionIdRef.current = data.session_id;
        }
        return;
      }
      if ("type" in data && data.type === "chunk") {
        assistantResponseBufferRef.current += data.data;
        upsertAssistantBubble({
          id: lastMessageIdRef.current,
          agentId: assistantId,
          content: assistantResponseBufferRef.current,
        });
        return;
      }
      if ("type" in data && data.type === "done") {
        upsertAssistantBubble({
          id: lastMessageIdRef.current,
          agentId: assistantId,
          content: assistantResponseBufferRef.current,
          isFinal: true,
        });
        return;
      }
      if ("error" in data && data.error) {
        upsertAssistantBubble({
          id: lastMessageIdRef.current,
          agentId: assistantId,
          content: FALLBACK_ERROR_MESSAGE,
          isFinal: true,
        });
      }
    },
    [agentProfiles, selectedAgentId, upsertAssistantBubble],
  );

  useEffect(() => {
    const currentSessionId = sessionIdRef.current;
    if (currentSessionId) {
      addSessionListener(currentSessionId, handleWsMessage);
      return () => {
        removeSessionListener(currentSessionId, handleWsMessage);
      };
    }
  }, [sessionId, addSessionListener, handleWsMessage, removeSessionListener]);

  // Subscribe globally so we can receive the initial context and session_id
  useEffect(() => {
    addGlobalListener(handleWsMessage);
    return () => removeGlobalListener(handleWsMessage);
  }, [addGlobalListener, removeGlobalListener, handleWsMessage]);

  const handleSendMessage = async (message: string, file?: File | null) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    ensureSessionStarted();

    if (!selectedAgentId) {
      pendingOptionsRef.current = { forceChatVisible: true };
    }

    const userEntry = {
      id: createMessageId(),
      role: "user" as const,
      content: trimmed,
    } satisfies ChatBubble;

    const assistantMeta =
      selectedAgentId && Object.values(agentProfiles).find((meta) => meta.id === selectedAgentId)
        ? (Object.values(agentProfiles).find((meta) => meta.id === selectedAgentId) as (typeof agentProfiles)[keyof typeof agentProfiles])
        : DEFAULT_AGENT;

    setActiveAgent(assistantMeta);

    lastMessageIdRef.current = createMessageId();
    assistantResponseBufferRef.current = "";
    isStreamingRef.current = true;

    const nextMessages: ChatBubble[] = [
      ...messages,
      userEntry,
      {
        id: lastMessageIdRef.current,
        role: "assistant" as const,
        content: "",
        agentId: assistantMeta.id,
        isStreaming: true,
      },
    ];

    propagateMessages(nextMessages);

    // Build WebSocket payloads matching backend contract
    const baseUserId = userDetails?.id || "demo-user";
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    const payload = sessionIdRef.current
      ? {
          action: "existingChat",
          session_id: sessionIdRef.current,
          agent: assistantMeta.id,
          user_input: trimmed,
          last_msg_timestamp: now,
          user_id: baseUserId,
        }
      : {
          action: "newChat",
          agent: assistantMeta.id,
          user_input: trimmed,
          user_id: baseUserId,
          ...(file
            ? {
                file_input: {
                  file_name: file.name,
                  s3_file_name: file.name,
                  file_type: file.type || "application/octet-stream",
                },
              }
            : {}),
        };

    console.info("[WebSocket] sending payload", payload);

    try {
      await send(payload);
    } catch (error) {
      console.error("# handleSendMessage failed", error);
      upsertAssistantBubble({
        id: lastMessageIdRef.current,
        agentId: assistantMeta.id,
        content: FALLBACK_ERROR_MESSAGE,
        isFinal: true,
      });
    }
  };

  const handleAgentSelect = (title: string) => {
    const meta = agentMeta[title as keyof typeof agentMeta];
    if (!meta) return;
    pendingOptionsRef.current = { forceChatVisible: true };
    setActiveAgent(meta);
  };

  // Exposing a single reset helper keeps the header, hero, and sidebar actions synchronized.
  const handleResetWorkspace = () => {
    setSelectedAgentId(null);
    pendingOptionsRef.current = { useLandingMessage: true };
    setActiveAgent(DEFAULT_AGENT);
    applyAgentSelection(DEFAULT_AGENT, { useLandingMessage: true });
  };

  const containerStyle = {
    minHeight: "calc(94vh - 56px)",
  };

  return (
    <AppShell onNewChat={handleResetWorkspace} showAgentDropdown={isChatVisible}>
      <div className="flex flex-1 flex-col gap-4 px-3 pb-4 pt-2 text-kaisa-midnight md:px-4" style={containerStyle}>
        {!isChatVisible && (
          <section className="mx-auto flex h-full w-full max-w-5xl flex-col gap-3">
            <div className="pt-15 text-center">
              <h1 className="text-xl font-bold sm:text-2xl md:text-2xl">
                <span className="text-kaisa-blue/80">{greetingLabel}, </span>
                <span className="text-kaisa-blue/80">{userName}.👋</span>
              </h1>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white/90 p-6 shadow-[0_32px_80px_-40px_rgba(37,56,88,0.45)]">
              <div className="grid flex-1 gap-5 overflow-hidden lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
                <div className="flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/40 bg-white/95 p-7 shadow-[0_18px_36px_-28px_rgba(37,56,88,0.42)]">
                  <div className="flex items-start gap-3">
                    <Image
                      src={DEFAULT_AGENT.icon}
                      alt={DEFAULT_AGENT.displayName}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-2xl border border-white/60 bg-kaisa-blue/10 object-cover"
                    />
                      <div className="flex flex-col gap-2">
                      <p className="rounded-2xl bg-kaisa-blue/10 px-5 py-3 text-sm text-kaisa-midnight/80">
                        I’m Teacher KAI, here to guide you today. Ask me your questions, or choose your guide—Aralyn for lesson guidance, Tallya for quizzes, or Revi for step-by-step review tips. Let’s get learning!
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      pendingOptionsRef.current = { forceChatVisible: true };
                    setActiveAgent(DEFAULT_AGENT);
                    applyAgentSelection(DEFAULT_AGENT, { forceChatVisible: true });
                    }}
                    className="self-end rounded-full border border-kaisa-blue/30 bg-kaisa-blue/10 px-4 py-2 text-xs font-semibold text-kaisa-blue transition hover:bg-kaisa-blue/15"
                  >
                    Chat with Teacher KAI
                  </button>
                </div>
                <div className="flex flex-col gap-3 overflow-hidden rounded-3xl border border-white/40 bg-white/95 p-4 shadow-[0_18px_32px_-26px_rgba(37,56,88,0.4)]">
                  <span className="text-xs font-semibold uppercase tracking-wide text-kaisa-midnight/60">Meet the Agents</span>
                  <div className="grid flex-1 gap-2 md:grid-cols-1">
                    {landingMentors.map((agent) => (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => handleAgentSelect(agent.title)}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-transparent bg-white px-3 py-2.5 text-left text-sm transition hover:-translate-y-0.5 hover:border-kaisa-yellow/30 hover:bg-kaisa-yellow/10"
                      >
                        <span className="flex items-center gap-3">
                          <Image
                            src={agent.icon}
                            alt={agent.displayName}
                            width={44}
                            height={44}
                            className="h-11 w-11 rounded-2xl border border-white/60 bg-kaisa-blue/10 object-cover"
                          />
                          <span className="flex flex-col">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-kaisa-midnight/60">
                              {agent.title}
                            </span>
                            <span className="text-sm font-medium text-kaisa-midnight">{agent.displayName}</span>
                          </span>
                        </span>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                          <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {isChatVisible && (
          <div className="flex h-full flex-1 flex-col rounded-3xl bg-white/90 p-6 shadow-[0_24px_50px_-28px_rgba(37,56,88,0.45)]">
            {/* Wrapping the message list keeps spacing consistent with the redesigned chat shell. */}
            <div className="scrollbar-thin flex flex-1 flex-col gap-4 overflow-y-auto py-4 pr-2 text-sm text-kaisa-midnight">
              {messages.map((message) => {
                const avatarAgent =
                  AGENT_PROFILES_BY_ID[message.agentId ?? ""] || DEFAULT_AGENT;
                const isUser = message.role === "user";
                return (
                  <div
                    key={message.id}
                    className={`flex max-w-[78%] items-end gap-3 ${
                      isUser ? "ml-auto justify-end text-right" : "text-left"
                    }`}
                  >
                    {!isUser && (
                      <Image
                        src={avatarAgent.icon}
                        alt={avatarAgent.displayName}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-2xl border border-white/60 bg-kaisa-blue/10 object-cover"
                      />
                    )}
                    <div
                      className={`rounded-3xl px-4 py-3 shadow-[0_18px_32px_-24px_rgba(37,56,88,0.35)] ${
                        isUser
                          ? "bg-kaisa-blue/80 text-white/90"
                          : "bg-kaisa-blue/10 text-kaisa-midnight/90"
                      }`}
                    >
                      {message.isStreaming && !message.content ? <LoadingDots /> : message.content}
                    </div>
                    {isUser && (
                      <Image
                        src="/images/sender-6.png"
                        alt="You"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-2xl border border-white/20 bg-kaisa-yellow/10 object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <ChatInput
              onSubmit={async (message) => {
                await handleSendMessage(message);
              }}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
