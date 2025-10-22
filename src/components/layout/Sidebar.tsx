"use client";

import { History, Info, MessageSquare, PanelLeftOpen, PanelRight, User } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/utils/cn";

const navItems = [
  { icon: MessageSquare, label: "New chat", key: "workspace" },
  // { icon: History, label: "Chat history", key: "chats" },
  { icon: Info, label: "About Us", key: "info" },
];

type SidebarProps = {
  onSelectNewChat?: () => void;
  onSelectChats?: () => void;
  onSelectInfo?: () => void;
};

export const Sidebar = ({ onSelectNewChat, onSelectChats, onSelectInfo }: SidebarProps) => {
  const [active, setActive] = useState<string>("workspace");
  const [collapsed, setCollapsed] = useState(false);
  const authStore = useAuthStore();

  return (
    <aside
      className={cn(
        "hidden h-full flex-shrink-0 flex-col border-r border-white/25 bg-white/40 py-6 shadow-[12px_0_42px_-28px_rgba(37,56,88,0.4)] backdrop-blur-lg lg:flex",
        collapsed ? "w-20 px-3" : "w-64 px-5",
        "transition-[width,padding] duration-300",
      )}
    >
      <div className="flex items-center pb-4 text-kaisa-midnight ml-2">
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white text-kaisa-blue shadow-sm"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4 text-kaisa-blue" /> : <PanelRight className="h-4 w-4 text-kaisa-blue" />}
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-8">
        <nav className="flex flex-col gap-2 text-kaisa-midnight/80 transition-all duration-300">
          {navItems.map(({ icon: Icon, label, key }) => {
            const isActive = active === key;
            return (
              <button
                key={label}
                type="button"
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition",
                  "hover:bg-kaisa-blue/10 hover:text-kaisa-midnight",
                  isActive && "text-kaisa-blue"
                )}
                onClick={() => {
                  setActive(key);
                  if (key === "workspace") {
                    onSelectNewChat?.();
                  }
                  if (key === "chats") {
                    onSelectChats?.();
                  }
                  if (key === "info") {
                    onSelectInfo?.();
                  }
                }}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-kaisa-blue",
                    isActive && "border-kaisa-blue/40"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                {!collapsed && <span className="truncate">{label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col gap-3 text-xs text-kaisa-midnight/70">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 shadow-sm transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl font-semibold text-kaisa-blue">
            {authStore.userDetails?.given_name?.[0] || <User className="h-5 w-5" />}
          </div>
          <div className={cn("min-w-0 flex-1 transition-all", collapsed && "hidden")}> 
            <span className="block truncate text-sm font-semibold text-kaisa-midnight">
              {authStore.userDetails?.given_name || "Student"}
            </span>
            <span className="block truncate text-[11px] text-kaisa-midnight/60">
              {authStore.userDetails?.email || "student@kaisa.com"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
