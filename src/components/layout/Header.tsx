"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { useAgentStore } from "@/stores/agentStore";
import { AGENT_PROFILES, AGENT_PROFILES_BY_ID, DEFAULT_AGENT } from "@/data/agents";
import { useEffect, useRef, useState } from "react";

export const Header = () => {
  const { activeAgent, setActiveAgent } = useAgentStore();
  const current = activeAgent || DEFAULT_AGENT;
  const options = [DEFAULT_AGENT, ...Object.values(AGENT_PROFILES)];

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      if (!dropdownRef.current || !isOpen) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickAway);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (agentId: string) => {
    const nextAgent = AGENT_PROFILES_BY_ID[agentId] || DEFAULT_AGENT;
    setActiveAgent(nextAgent);
    setIsOpen(false);
  };

  return (
    <header className="relative z-[70] flex items-center justify-between gap-4 border-b border-white/10 bg-white/20 px-4 py-2.5 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => console.info("TODO: toggle mobile nav")}
          className="inline-flex rounded-full border border-white/20 bg-white/30 p-1.5 text-kaisa-midnight transition md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="fixed top-0 left-2 z-50 flex items-center gap-2 p-2">
          <Image src="/kaisa-logo-1.png" alt="KAISA" width={52} height={52} />
          <span className="text-lg font-semibold tracking-wide text-kaisa-blue">KAISA</span>
        </div>
      </div>
      <div className="relative hidden items-center gap-2 md:flex" ref={dropdownRef}>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-white/50 px-3 py-1.5 text-sm font-medium text-kaisa-midnight shadow-[0_8px_28px_-16px_rgba(12,76,179,0.35)] outline-none transition hover:bg-white/70"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <Image
            src={current.icon}
            alt={current.displayName}
            width={20}
            height={20}
            className="h-5 w-5 rounded-full object-cover"
          />
          <span>{current.displayName}</span>
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-[calc(100%+0.75rem)] z-[120] w-60 rounded-2xl border border-white/20 bg-white/85 p-2 text-sm text-kaisa-midnight shadow-[0_20px_45px_-28px_rgba(12,76,179,0.45)] backdrop-blur-xl">
            <ul className="flex flex-col gap-1" role="listbox" aria-activedescendant={current.id}>
              {options.map((agent) => (
                <li key={agent.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(agent.id)}
                    role="option"
                    aria-selected={agent.id === current.id}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      agent.id === current.id
                        ? "border-kaisa-blue/40 bg-kaisa-blue/12 text-kaisa-blue"
                        : "border-transparent hover:border-kaisa-yellow/40 hover:bg-kaisa-yellow/10"
                    }`}
                  >
                    <Image
                      src={agent.icon}
                      alt={agent.displayName}
                      width={20}
                      height={20}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wide text-kaisa-midnight/60">
                        {agent.title}
                      </span>
                      <span className="text-sm font-medium text-kaisa-midnight">{agent.displayName}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};
