"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ChatInput } from "@/components/chat/ChatInput";
import { useAuthStore } from "@/stores/authStore";
import { quickActionCards } from "@/assets";
import { useEffect, useRef, useState } from "react";
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

type ChatBubble = {
  id: number;
  role: "user" | "assistant";
  content: string;
  agentId?: string;
};

export default function Home() {
  const { userDetails } = useAuthStore();
  const userName = userDetails?.given_name || userDetails?.family_name || "there";
  const { setActiveAgent, activeAgent } = useAgentStore();
  const { setSessionStarted, sessionStarted, clear } = useChatStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [hasSessionStarted, setHasSessionStarted] = useState(false);
  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hey there! 👋 I’m Teacher KAI, your guide for today. What are we exploring? Need help with a task, a concept, or just curious about something new?",
      agentId: DEFAULT_AGENT.id,
    },
  ]);

  const defaultAgent = DEFAULT_AGENT;

  const agentProfiles = AGENT_PROFILES;

  const ensureSessionStarted = () => {
    if (!hasSessionStarted) {
      setHasSessionStarted(true);
      setSessionStarted(true);
    }
  };

  const syncAssistantIntro = (
    agent: (typeof AGENT_PROFILES)[keyof typeof AGENT_PROFILES] | typeof DEFAULT_AGENT,
  ) => {
    setMessages((prev) => {
      const next = [...prev];
      if (next.length === 0 || next[0]?.role !== "assistant") {
        next.unshift({
          id: Date.now(),
          role: "assistant",
          content: agent.content,
          agentId: agent.id,
        });
      } else {
        next[0] = { ...next[0], content: agent.content, agentId: agent.id };
      }
      return next;
    });
  };

  const applyAgentSelection = (agent: typeof DEFAULT_AGENT | (typeof AGENT_PROFILES)[keyof typeof AGENT_PROFILES]) => {
    if (agent.id !== DEFAULT_AGENT.id) {
      ensureSessionStarted();
      setSelectedAgentId(agent.id);
    } else {
      setSelectedAgentId(null);
    }
    syncAssistantIntro(agent);
  };

  const previousAgentIdRef = useRef<string | undefined>();

  useEffect(() => {
    if (!activeAgent) return;
    if (previousAgentIdRef.current === activeAgent.id) return;
    previousAgentIdRef.current = activeAgent.id;
    applyAgentSelection(activeAgent);
  }, [activeAgent]);

  const propagateMessages = (nextMessages: typeof messages) => {
    setMessages(nextMessages);
  };

  const handleSendMessage = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    ensureSessionStarted();

    if (!selectedAgentId) {
      setActiveAgent(defaultAgent);
      applyAgentSelection(defaultAgent);
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
    setActiveAgent(meta);
  };

  const sessionActive = hasSessionStarted || sessionStarted;
  const containerStyle = {
    minHeight: "calc(100vh - 56px)",
  };

  return (
    <AppShell
      onNewChat={() => {
        setSelectedAgentId(null);
        setHasSessionStarted(false);
        setSessionStarted(false);
        setMessages([
          {
            id: 1,
            role: "assistant",
            content: defaultAgent.content,
            agentId: defaultAgent.id,
          },
        ]);
        setActiveAgent(defaultAgent);
        clear();
      }}
    >
      <div
        className={`flex flex-1 flex-col ${
          sessionActive
            ? "items-stretch gap-1 px-2 pt-0 pb-2"
            : "items-center gap-12 px-6 py-10"
        }`}
        style={containerStyle}
      >
        {!sessionActive && (
          <>
            <header className="flex flex-col items-center gap-3 text-center text-kaisa-midnight">
              <h1 className="text-3xl font-semibold">Hello, {userName}.</h1>
              <p className="text-xl font-semibold text-kaisa-blue">
                What can I help you with?
              </p>
            </header>
            <div className="grid w-full max-w-4xl gap-5 md:grid-cols-3">
              {quickActionCards.map((card) => {
                const meta = agentMeta[card.title as keyof typeof agentMeta];
                return (
                  <button
                    key={card.title}
                    type="button"
                    onClick={() => handleAgentSelect(card.title)}
                    className="group flex h-full flex-col gap-3 rounded-2xl border border-white/20 bg-white/70 p-5 text-left shadow transition-transform duration-300 hover:-translate-y-1 hover:border-kaisa-yellow/70 hover:bg-white/75 hover:shadow-[0_12px_28px_-18px_rgba(249,200,14,0.45)]"
                  >
                    <div className="flex items-center gap-3">
                      {meta && (
                        <Image
                          src={meta.icon}
                          alt={meta.displayName}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full bg-kaisa-blue/12 object-cover"
                        />
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-kaisa-midnight">{card.title}</p>
                        {meta && (
                          <p className="text-xs text-kaisa-midnight/70">{meta.displayName}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-kaisa-midnight/80">{card.caption}</p>
                    <p className="text-xs italic text-kaisa-midnight/60">“{card.prompt}”</p>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div
          className={`flex w-full flex-col gap-4 ${
            sessionActive
              ? "max-w-full rounded-3xl bg-white/70 p-2 shadow-[0_12px_40px_-24px_rgba(12,76,179,0.25)] backdrop-blur h-[880px]"
              : "max-w-4xl rounded-3xl border border-white/25 bg-white/70 p-2 shadow-[0_24px_60px_-32px_rgba(12,76,179,0.28)] backdrop-blur-xl"
          }`}
        >

          {/* Alternative approach: convert to CSS Grid full-height layout or place ChatInput absolutely at bottom */}
          <div
            className={`scrollbar-thin flex flex-1 flex-col gap-3 overflow-y-auto rounded-2xl bg-white/90 p-5 text-sm text-kaisa-midnight shadow-inner ${
              sessionActive ? "h-[calc(100vh-5rem)]" : "h-64"
            }`}
          >
            {messages.map((message) => {
              const avatarAgent =
                AGENT_PROFILES_BY_ID[message.agentId ?? ""] || DEFAULT_AGENT;
              return (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-auto flex max-w-[80%] justify-end"
                      : "flex max-w-[80%]"
                  }
                >
                  {message.role === "assistant" && (
                    <Image
                      src={avatarAgent.icon}
                      alt={avatarAgent.displayName}
                      width={32}
                      height={32}
                      className="mr-3 mt-1 h-8 w-8 flex-shrink-0 rounded-full object-cover bg-kaisa-blue/20"
                    />
                  )}
                  <div
                    className={
                      message.role === "user"
                        ? "rounded-2xl bg-kaisa-blue px-4 py-2 text-sm text-white shadow"
                        : "rounded-2xl bg-kaisa-blue/10 px-4 py-2 text-sm text-kaisa-midnight/90"
                    }
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <Image
                    src="/images/sender-6.png"
                    alt={avatarAgent.displayName}
                    width={52}
                    height={52}
                    className="ml-3 mt-1 h-8 w-8 flex-shrink-0 rounded-full bg-kaisa-yellow/5"
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
      </div>
    </AppShell>
  );
}
