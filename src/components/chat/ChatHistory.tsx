"use client";

import { useEffect } from "react";
import { chatApi } from "@/lib/api/chat";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessage } from "@/types/chat";

export type ChatHistoryProps = {
  sessionId: string;
};

export const ChatHistory = ({ sessionId }: ChatHistoryProps) => {
  const { messages, setMessages } = useChatStore();

  useEffect(() => {
    const load = async () => {
      if (!sessionId) return;
      try {
        const response = await chatApi.getMessages(sessionId);
        setMessages(response.data?.data ?? []);
      } catch (error) {
        console.error("[ChatHistory] Failed to load messages", error);
      }
    };

    void load();
  }, [sessionId, setMessages]);

  if (!messages.length) {
    return (
      <div className="flex min-h-[340px] items-center justify-center rounded-3xl border border-dashed border-kaisa-blue/30 bg-white/40">
        <div className="space-y-2 text-center">
          <p className="text-base font-semibold text-kaisa-midnight">Say hello to KAISA</p>
          <p className="text-sm text-kaisa-midnight/60">How can we support your next idea today?</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message: ChatMessage) => (
        <div key={`${message.timestamp}-${message.role}`} className="text-kaisa-midnight/80">
          <span className="text-xs uppercase tracking-[0.3em] text-kaisa-blue/50">{new Date(message.timestamp).toLocaleTimeString()}</span>
          <p className="mt-1 text-sm">{message.message}</p>
        </div>
      ))}
    </div>
  );
};
