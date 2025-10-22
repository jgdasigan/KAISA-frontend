"use client";

import { useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";

export type ChatHistoryProps = {
  sessionId: string;
};

export const ChatHistory = ({ sessionId }: ChatHistoryProps) => {
  const { messages, setMessages } = useChatStore();

  useEffect(() => {
    const load = async () => {
      if (!sessionId) return;
      // # REST fetching removed for WebSocket-only mode
      setMessages([]);
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
      {messages.map((message) => (
        <div key={message.id} className="text-kaisa-midnight/80">
          <p className="mt-1 text-sm">{message.content}</p>
        </div>
      ))}
    </div>
  );
};
