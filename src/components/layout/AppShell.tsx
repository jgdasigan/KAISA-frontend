"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatHistoryPanel } from "@/components/layout/ChatHistoryPanel";
import { AboutModal } from "@/components/modals/AboutModal";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  return (
    <div className="relative flex min-h-screen flex-col bg-transparent">
      <Header />
      <div className="flex flex-1">
        <Sidebar
          onSelectChats={() => setShowHistory((prev) => !prev)}
          onSelectInfo={() => setShowAbout(true)}
        />
        {showHistory && (
          <div className="hidden w-full max-w-sm border-r border-white/10 bg-white/40 px-4 py-6 backdrop-blur lg:block">
            <ChatHistoryPanel />
          </div>
        )}
        <main className="flex-1 overflow-y-auto bg-transparent px-6 py-10 md:px-10">
          {children}
        </main>
      </div>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};
