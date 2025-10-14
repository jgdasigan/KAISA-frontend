"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ChatInput } from "@/components/chat/ChatInput";
import { Lightbulb, Sparkles } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { quickActionCards } from "@/assets";

export default function Home() {
  const { userDetails } = useAuthStore();
  const userName = userDetails?.given_name || userDetails?.family_name || "there";

  return (
    <AppShell>
      <div className="flex flex-1 flex-col items-center justify-center gap-12 px-6">
        <header className="flex flex-col items-center gap-3 text-center text-kaisa-midnight">
          <h1 className="text-3xl font-semibold">Hello, {userName}.</h1>
          <p className="max-w-xl text-2xl font-semibold text-transparent bg-gradient-to-r from-kaisa-blue via-kaisa-yellow to-kaisa-red bg-clip-text">
            What can I help you with?
          </p>
        </header>

        <div className="grid w-full max-w-4xl gap-5 md:grid-cols-3">
          {quickActionCards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>

        <div className="w-full max-w-4xl rounded-3xl border border-white/25 bg-white/70 p-4 shadow-[0_24px_60px_-32px_rgba(12,76,179,0.28)] backdrop-blur-xl">
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
