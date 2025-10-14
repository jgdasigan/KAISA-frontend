"use client";

import { MessageCircle, FileText, Settings, Disc, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/utils/cn";

const navItems = [
  { icon: Disc, label: "Workspace", key: "workspace" },
  { icon: MessageCircle, label: "Chats", key: "chats" },
  { icon: FileText, label: "Library", key: "library" },
  { icon: Settings, label: "Settings", key: "settings" },
];

type SidebarProps = {
  onSelectChats?: () => void;
};

export const Sidebar = ({ onSelectChats }: SidebarProps) => {
  const [active, setActive] = useState<string>("workspace");
  const authStore = useAuthStore();
  return (
    <aside className="hidden w-24 flex-shrink-0 flex-col items-center justify-between border-r border-white/10 bg-white/30 py-6 backdrop-blur-xl lg:flex">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-kaisa-blue text-white shadow-lg">
          <Disc className="h-5 w-5" />
        </div>
        <nav className="flex flex-1 flex-col items-center gap-3 text-kaisa-midnight/70">
          {navItems.map(({ icon: Icon, label, key }) => (
            <button
              key={label}
              type="button"
              className={cn(
                "relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 text-kaisa-blue shadow-sm transition",
                active === key
                  ? "bg-gradient-to-br from-kaisa-blue/95 via-kaisa-blue to-kaisa-midnight/90 text-white shadow-[0_12px_32px_-12px_rgba(12,76,179,0.7)]"
                  : "hover:bg-kaisa-yellow/80 hover:text-kaisa-midnight"
              )}
              aria-label={label}
              onClick={() => {
                setActive(key);
                if (key === "chats") {
                  onSelectChats?.();
                }
              }}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </nav>
      </div>
      <div className="flex flex-col items-center gap-3 text-xs text-kaisa-midnight/70">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kaisa-yellow text-kaisa-midnight font-semibold">
          {authStore.userDetails?.given_name?.[0] || "K"}
        </div>
        <button
          type="button"
          onClick={() => authStore.clearSession()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-kaisa-blue shadow-sm transition hover:bg-kaisa-red/80 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
};
