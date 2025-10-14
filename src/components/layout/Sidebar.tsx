"use client";

import { MessageCircle, FileText, Settings, Disc, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/utils/cn";

const navItems = [
  { icon: Disc, label: "New chat", key: "workspace" },
  { icon: MessageCircle, label: "Chat history", key: "chats" },
  { icon: FileText, label: "Agent library", key: "library" },
  { icon: Settings, label: "Settings", key: "settings" },
];

type SidebarProps = {
  onSelectChats?: () => void;
};

export const Sidebar = ({ onSelectChats }: SidebarProps) => {
  const [active, setActive] = useState<string>("workspace");
  const authStore = useAuthStore();

  return (
    <aside className="group hidden w-24 flex-shrink-0 flex-col border-r border-white/10 bg-white/30 py-6 backdrop-blur-xl transition-all duration-200 hover:w-56 lg:flex">
      <div className="flex flex-1 flex-col gap-6 px-4">
        <nav className="mt-2 flex flex-1 flex-col gap-2 text-kaisa-midnight/70">
          {navItems.map(({ icon: Icon, label, key }) => {
            const isActive = active === key;
            return (
              <button
                key={label}
                type="button"
                className={cn(
                  "group/item flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200",
                  "bg-white/60 text-kaisa-blue shadow-sm backdrop-blur",
                  !isActive && "hover:bg-kaisa-yellow/75 hover:text-kaisa-midnight",
                  isActive && "border border-kaisa-blue/40 bg-kaisa-blue/15 text-kaisa-blue shadow-[0_8px_22px_-12px_rgba(12,76,179,0.45)]"
                )}
                onClick={() => {
                  setActive(key);
                  if (key === "chats") {
                    onSelectChats?.();
                  }
                }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-kaisa-blue shadow-inner">
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={cn(
                    "hidden flex-1 truncate text-left text-xs font-medium text-kaisa-midnight/80 transition lg:hidden",
                    "group-hover:flex",
                    isActive && "text-kaisa-blue"
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col gap-2 px-4 text-xs text-kaisa-midnight/70">
        <div className="group/profile flex items-center gap-3 rounded-2xl bg-white/60 px-3 py-2 shadow-sm transition-all duration-200">
          <div className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full bg-kaisa-yellow text-kaisa-midnight font-semibold">
            {authStore.userDetails?.given_name?.[0] || "K"}
          </div>
          <div className="min-w-0 flex-1 flex-col text-left text-xs hidden group-hover/profile:flex lg:flex">
            <span className="truncate text-sm font-semibold text-kaisa-midnight">
              {authStore.userDetails?.given_name || "KAISA User"}
            </span>
            <span className="truncate text-[11px] text-kaisa-midnight/70">
              {authStore.userDetails?.email || "user@kaisa.ai"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => authStore.clearSession()}
            className="hidden h-8 w-8 items-center justify-center rounded-full bg-kaisa-red/85 text-white shadow-sm transition hover:bg-kaisa-red group-hover/profile:inline-flex"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
