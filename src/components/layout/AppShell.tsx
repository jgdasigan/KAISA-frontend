"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatHistoryPanel } from "@/components/layout/ChatHistoryPanel";
import { AboutModal } from "@/components/modals/AboutModal";

type AppShellProps = {
  children: ReactNode;
  onNewChat?: () => void;
};

export const AppShell = ({ children, onNewChat }: AppShellProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  return (
    <div className="relative flex h-screen flex-col bg-transparent">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onSelectNewChat={onNewChat}
          onSelectChats={() => setShowHistory((prev) => !prev)}
          onSelectInfo={() => setShowAbout(true)}
        />
        {showHistory && (
          <div className="hidden w-full max-w-sm border-r border-white/10 bg-white/40 px-4 py-6 backdrop-blur lg:block">
            <ChatHistoryPanel />
          </div>
        )}
        <main className="flex-1 overflow-hidden bg-transparent px-3 py-4 md:px-6 md:py-6">
          {/* Alternative approach: wrap children in CSS Grid and set chat area as auto rows to avoid nested scrolling */}
          {children}
        </main>
      </div>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};
