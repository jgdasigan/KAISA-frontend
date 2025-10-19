"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ChatInput } from "@/components/chat/ChatInput";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAgentStore } from "@/stores/agentStore";
import Image from "next/image";
import { useChatStore } from "@/stores/chatStore";
import {
  AGENT_PROFILES,
  AGENT_PROFILES_BY_ID,
  AGENT_PROFILES_BY_TITLE,
  DEFAULT_AGENT,
} from "@/data/agents";

const agentMeta = AGENT_PROFILES_BY_TITLE;
const LANDING_KAI_MESSAGE =
  "I’m Teacher KAI, here to guide you today. Ask me your questions, or choose your mentor above: Principal Aralyn for lesson guidance, Tallya for quizzes, or Kuya Revi for step-by-step review tips. Let’s get learning!";

type ChatBubble = {
  id: number;
  role: "user" | "assistant";
  content: string;
  agentId?: string;
};

export default function Home() {
  const { userDetails } = useAuthStore();
  const userName = userDetails?.given_name || userDetails?.family_name || "Joyce";
  const { setActiveAgent, activeAgent } = useAgentStore();
  const { setSessionStarted } = useChatStore();
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

  const defaultAgent = DEFAULT_AGENT;

  const agentProfiles = AGENT_PROFILES;
  const currentAgent = activeAgent || defaultAgent;
  const previousAgentIdRef = useRef<string | undefined>();
  const pendingOptionsRef = useRef<{ useLandingMessage?: boolean; forceChatVisible?: boolean } | null>(null);

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
      setSessionStarted(true);
      syncAssistantIntro(DEFAULT_AGENT, DEFAULT_AGENT.content);
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
      syncAssistantIntro(agent, LANDING_KAI_MESSAGE);
      setHasSessionStarted(false);
      setSessionStarted(false);
      setSelectedAgentId(null);
      setIsChatVisible(false);
      return;
    }

    ensureSessionStarted();
    setIsChatVisible(true);
    setSelectedAgentId(agent.id);
    syncAssistantIntro(agent);
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

    applyAgentSelection(activeAgent, {
      useLandingMessage: shouldUseLandingCopy,
      forceChatVisible: pendingOptions?.forceChatVisible,
    });
  }, [activeAgent, hasSessionStarted]);

  const propagateMessages = (nextMessages: typeof messages) => {
    setMessages(nextMessages);
  };

  const handleSendMessage = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    ensureSessionStarted();

    if (!selectedAgentId) {
      pendingOptionsRef.current = { forceChatVisible: true };
      setActiveAgent(defaultAgent);
    }

    const userEntry = {
      id: Date.now(),
      role: "user" as const,
      content: trimmed,
    } satisfies ChatBubble;

    const assistantMeta =
      selectedAgentId && Object.values(agentProfiles).find((meta) => meta.id === selectedAgentId)
        ? (Object.values(agentProfiles).find((meta) => meta.id === selectedAgentId) as (typeof agentProfiles)[keyof typeof agentProfiles])
        : defaultAgent;

    setActiveAgent(assistantMeta);

    propagateMessages([
      ...messages,
      userEntry,
      {
        id: Date.now() + 1,
        role: "assistant" as const,
        content: "Sorry, I am having trouble processing your request.",
        agentId: assistantMeta.id,
      },
    ]);
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
    setActiveAgent(defaultAgent);
    applyAgentSelection(defaultAgent, { useLandingMessage: true });
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
                <span className="text-kaisa-blue/80">{userName}. 👋</span>
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
                    setActiveAgent(defaultAgent);
                    applyAgentSelection(defaultAgent, { forceChatVisible: true });
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
                        className="flex items-center justify-between gap-3 rounded-2xl border border-transparent bg-white px-3 py-2.5 text-left text-sm transition hover:-translate-y-0.5 hover:border-kaisa-purple/30 hover:bg-kaisa-purple/10"
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
                          ? "bg-gradient-to-br from-kaisa-blue to-kaisa-dark-blue text-white"
                          : "bg-white text-kaisa-midnight/90"
                      }`}
                    >
                      {message.content}
                    </div>
                    {isUser && (
                      <Image
                        src="/images/sender-6.png"
                        alt="You"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-2xl border border-white/60 bg-kaisa-yellow/10 object-cover"
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
