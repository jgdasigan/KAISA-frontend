"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ChatInput } from "@/components/chat/ChatInput";
import { Lightbulb, Sparkles } from "lucide-react";
import { ActionButton } from "@/components/cards/ActionButton";

export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-12 px-6">
        <header className="flex flex-col items-center gap-3 text-center text-kaisa-midnight">
          <h1 className="text-3xl font-semibold">Agent Chat</h1>
          <p className="max-w-xl text-sm text-kaisa-midnight/70">
            A chatbot-driven hub that transforms your ideas into presentations, code, and marketing narratives—all in KAISA’s vibrant palette.
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <ActionButton icon={Sparkles} label="Sales Performance" variant="ghost" />
          <ActionButton icon={Lightbulb} label="Customer Insights" />
          <ActionButton icon={Sparkles} label="Scenario 3" variant="ghost" />
          <ActionButton icon={Lightbulb} label="Scenario 4" variant="ghost" />
          <ActionButton icon={Sparkles} label="Scenario 5" variant="ghost" />
        </div>

        <div className="w-full max-w-4xl rounded-3xl border border-white/20 bg-white/60 p-6 shadow-[0_24px_60px_-32px_rgba(12,76,179,0.45)] backdrop-blur-2xl">
          <ChatInput
            onSubmit={async () => {
              console.info("Chat submission placeholder");
            }}
          />
        </div>
      </div>
    </AppShell>
  );
}
