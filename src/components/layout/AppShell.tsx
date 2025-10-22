"use client";

import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AboutModal } from "@/components/modals/AboutModal";
import { useWsStore } from "@/stores/wsStore";

type AppShellProps = {
  children: ReactNode;
  onNewChat?: () => void;
  showAgentDropdown?: boolean;
};

export const AppShell = ({ children, onNewChat, showAgentDropdown = true }: AppShellProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  type HistoryItem = { role: "user" | "assistant"; content: string };
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const { send, isConnected } = useWsStore();

  useEffect(() => {
    if (!showHistory) return;
    try {
      const raw = typeof localStorage !== "undefined" ? localStorage.getItem("kaisa_last_history") : null;
      const parsed = raw ? (JSON.parse(raw) as HistoryItem[]) : [];
      setHistoryItems(parsed);
      if (!parsed.length) {
        const lastId = typeof localStorage !== "undefined" ? localStorage.getItem("kaisa_last_session_id") : null;
        if (isConnected && lastId) {
          const now = new Date().toISOString().slice(0, 19).replace("T", " ");
          void send({ action: "existingChat", session_id: lastId, user_input: "", user_id: "demo-user", last_msg_timestamp: now } as Record<string, unknown>);
          setTimeout(() => {
            try {
              const latest = localStorage.getItem("kaisa_last_history");
              setHistoryItems(latest ? (JSON.parse(latest) as any[]) : []);
            } catch {}
          }, 700);
        }
      }
    } catch {}
  }, [showHistory, isConnected, send]);
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
            <div className="flex h-full flex-col gap-2 overflow-y-auto text-sm text-kaisa-midnight">
              <span className="pb-2 text-xs font-semibold uppercase tracking-wide text-kaisa-midnight/60">Recent</span>
              {historyItems.slice().reverse().map((m: HistoryItem, idx: number) => (
                <div key={idx} className="rounded-xl bg-white/80 p-2 shadow-sm">
                  <div className="text-[11px] uppercase tracking-wide text-kaisa-midnight/50">{m.role === "user" ? "You" : "Assistant"}</div>
                  <div className="line-clamp-3 text-[12px] text-kaisa-midnight/90">{m.content?.replace(/<[^>]+>/g, "")}</div>
                </div>
              ))}
              {!historyItems.length && (
                <div className="flex h-full flex-col items-center justify-center text-xs text-kaisa-midnight/60">No history yet</div>
              )}
            </div>
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
