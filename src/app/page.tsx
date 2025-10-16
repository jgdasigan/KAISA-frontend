"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ChatInput } from "@/components/chat/ChatInput";
import { useAuthStore } from "@/stores/authStore";
import { quickActionCards } from "@/assets";
import { useState } from "react";
import { useAgentStore } from "@/stores/agentStore";
import Image from "next/image";
import { useChatStore } from "@/stores/chatStore";

export default function Home() {
  const { userDetails } = useAuthStore();
  const userName = userDetails?.given_name || userDetails?.family_name || "there";
  const { setActiveAgent } = useAgentStore();
  const { setSessionStarted, sessionStarted, clear } = useChatStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [hasSessionStarted, setHasSessionStarted] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ id: number; role: "user" | "assistant"; content: string }>
  >([
    {
      id: 1,
      role: "assistant",
      content:
        "Hey there! 👋 I’m Teacher KAI, your guide for today. What are we exploring? Need help with a task, a concept, or just curious about something new?",
    },
  ]);

  const defaultAgent = {
    id: "kaisa-default",
    displayName: "Teacher KAI",
    icon: "/images/kai.png",
    content:
      "Hi! I’m Teacher KAI, your guide for today. What are we exploring? Need help with a task, a concept, or just curious about something new?",
  };

  const agentMeta = {
    "Curriculum Agent": {
      id: "curriculum",
      displayName: "Principal Aralyn",
      icon: "/images/aralyn.png",
      content: "Hello! I’m Principal Aralyn. ✨ Let’s make sure everything’s in order. What lesson, topic, or plan do you need help perfecting today?",
    },
    "Quizzer Agent": {
      id: "quizzer",
      displayName: "Tallya",
      icon: "/images/tallya.png",
      content: "Hi! I’m Tallya, your study buddy! 📝 Ready to tackle some questions or quiz yourself? Let’s get you acing this together—challenge accepted!",
    },
    "Review Agent": {
      id: "review",
      displayName: "Kuya Revi",
      icon: "/images/revi.png",
      content: "Hey! Kuya Revi here. 😎 Don’t worry, we’ll go step by step. What are we reviewing today? I’ll guide you and maybe throw in a joke or two while we learn!",
    },
  } as const;

  const propagateMessages = (nextMessages: typeof messages) => {
    setMessages(nextMessages);
  };

  const handleSendMessage = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    if (!hasSessionStarted) {
      setHasSessionStarted(true);
      setSessionStarted(true);
    }

    if (!selectedAgentId) {
      setActiveAgent(defaultAgent);
      setMessages((prev) => {
        const next = [...prev];
        if (next.length === 0 || next[0]?.role !== "assistant") {
          next.unshift({
            id: Date.now(),
            role: "assistant",
            content: defaultAgent.content,
          });
        } else {
          next[0] = { ...next[0], content: defaultAgent.content };
        }
        return next;
      });
    }

    const userEntry = {
      id: Date.now(),
      role: "user" as const,
      content: trimmed,
    };

    const assistantMeta =
      selectedAgentId && Object.values(agentMeta).find((meta) => meta.id === selectedAgentId)
        ? (Object.values(agentMeta).find((meta) => meta.id === selectedAgentId) as (typeof agentMeta)[keyof typeof agentMeta])
        : defaultAgent;

    setActiveAgent((prev) => prev || assistantMeta);

    propagateMessages([...messages, userEntry, {
      id: Date.now() + 1,
      role: "assistant" as const,
      content: "Sorry, I am having trouble processing your request.",
    }]);
  };

  const handleAgentSelect = (title: string) => {
    const meta = agentMeta[title as keyof typeof agentMeta];
    if (!meta) return;
    setSelectedAgentId(meta.id);
    setActiveAgent(meta);
    if (!hasSessionStarted) {
      setHasSessionStarted(true);
      setSessionStarted(true);
    }
    setMessages((prev) => {
      const next = [...prev];
      if (next.length === 0 || next[0].role !== "assistant") {
        next.unshift({ id: Date.now(), role: "assistant", content: meta.content });
      } else {
        next[0] = { ...next[0], content: meta.content };
      }
      return next;
    });
  };

  const sessionActive = hasSessionStarted || sessionStarted;

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
          },
        ]);
        setActiveAgent(defaultAgent);
        clear();
      }}
    >
      <div
        className={`flex h-full flex-1 flex-col gap-10 px-6 ${
          sessionActive ? "items-stretch justify-start pt-4 pb-6" : "items-center justify-center py-10"
        }`}
      >
        <header className="flex flex-col items-center gap-3 text-center text-kaisa-midnight">
          {!sessionActive && (
            <>
              <h1 className="text-3xl font-semibold">Hello, {userName}.</h1>
              <p className="text-xl font-semibold text-kaisa-blue">
                What can I help you with?
              </p>
            </>
          )}
        </header>

        {!sessionStarted && (
          <div className="grid w-full max-w-4xl gap-5 md:grid-cols-3">
            {quickActionCards.map((card) => {
              const meta = agentMeta[card.title as keyof typeof agentMeta];
              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => handleAgentSelect(card.title)}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-white/20 bg-white/70 p-5 text-left transition hover:border-kaisa-blue/40 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    {meta && (
                      <Image
                        src={meta.icon}
                        alt={meta.displayName}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full bg-white object-cover"
                      />
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-kaisa-midnight">{card.title}</p>
                      {meta && (
                        <p className="text-xs text-kaisa-midnight/70">Persona: {meta.displayName}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-kaisa-midnight/80">{card.caption}</p>
                  <p className="text-xs italic text-kaisa-midnight/60">“{card.prompt}”</p>
                </button>
              );
            })}
          </div>
        )}

        <div
          className={`flex w-full flex-1 flex-col gap-4 rounded-3xl border border-white/25 bg-white/70 p-4 shadow-[0_24px_60px_-32px_rgba(12,76,179,0.28)] backdrop-blur-xl ${
            sessionActive ? "max-w-full" : "max-w-4xl"
          }`}
        >
          <div
            className={`scrollbar-thin flex flex-1 flex-col gap-3 overflow-y-auto rounded-2xl bg-white/90 p-4 text-sm text-kaisa-midnight shadow-inner ${
              sessionActive ? "min-h-[calc(100vh-16rem)]" : "h-64"
            }`}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto flex max-w-[80%] justify-end"
                    : "flex max-w-[80%]"
                }
              >
                {message.role === "assistant" && (
                  <div className="mr-3 mt-1 h-8 w-8 flex-shrink-0 rounded-full bg-kaisa-blue/20" />
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
                  <div className="ml-3 mt-1 h-8 w-8 flex-shrink-0 rounded-full bg-kaisa-blue text-white" />
                )}
              </div>
            ))}
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
