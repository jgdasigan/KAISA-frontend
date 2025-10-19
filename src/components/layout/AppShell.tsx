"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatHistoryPanel } from "@/components/layout/ChatHistoryPanel";
import { AboutModal } from "@/components/modals/AboutModal";

type AppShellProps = {
  children: ReactNode;
  onNewChat?: () => void;
  showAgentDropdown?: boolean;
};

export const AppShell = ({ children, onNewChat, showAgentDropdown = true }: AppShellProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  return (
    <div className="relative flex h-screen flex-col bg-transparent">
      <Header showAgentDropdown={showAgentDropdown} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onSelectNewChat={onNewChat}
          onSelectChats={() => setShowHistory((prev) => !prev)}
          onSelectInfo={() => setShowAbout(true)}
        />
        {showHistory && (
          <div className="hidden w-full max-w-sm border-r border-white/10 bg-white/60 px-5 py-6 shadow-lg backdrop-blur lg:block">
            <ChatHistoryPanel />
          </div>
        )}
        <main className="flex-1 overflow-hidden px-4 py-6 md:px-8">
          {/* Reshape the workspace container so children can define multi-column layouts similar to the new reference */}
          {children}
        </main>
      </div>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};
