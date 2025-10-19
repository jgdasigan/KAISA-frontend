"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { useAgentStore } from "@/stores/agentStore";
import { AGENT_PROFILES, AGENT_PROFILES_BY_ID, DEFAULT_AGENT } from "@/data/agents";
import { useEffect, useRef, useState } from "react";

type HeaderProps = {
  showAgentDropdown?: boolean;
};

export const Header = ({ showAgentDropdown = true }: HeaderProps) => {
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
    <header className="relative z-[80] flex items-center justify-between gap-4 border-b border-white/30 bg-white/70 px-6 py-4 shadow-[0_16px_40px_-32px_rgba(37,56,88,0.6)] backdrop-blur-xl md:px-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => console.info("TODO: toggle mobile nav")}
          className="inline-flex rounded-full border border-white/70 bg-white/80 p-2 text-kaisa-midnight transition md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 pl-[0.001rem]">
          <Image src="/kaisa-logo-1.png" alt="KAISA" width={60} height={60} className="h-13 w-13 -ml-5" />
          <span className="text-xl font-bold tracking-wide text-kaisa-dark-blue">
            K<span className="text-kaisa-blue">AI</span>SA
          </span>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        {showAgentDropdown && (
          <div className="hidden items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-inner md:flex">
            <span className="text-xs font-semibold uppercase tracking-wide text-kaisa-midnight/60">
              Active Agent
            </span>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-medium text-kaisa-midnight shadow-[0_10px_24px_-20px_rgba(37,56,88,0.55)] outline-none transition hover:bg-kaisa-blue/10"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
              >
                <Image
                  src={current.icon}
                  alt={current.displayName}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full object-cover"
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
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-[120] w-64 rounded-3xl border border-white/40 bg-white/95 p-3 text-sm text-kaisa-midnight shadow-[0_24px_55px_-25px_rgba(37,56,88,0.55)] backdrop-blur-xl">
                  <span className="block pb-2 text-xs font-semibold uppercase tracking-wide text-kaisa-midnight/60">
                    Switch agent
                  </span>
                  <ul className="flex flex-col gap-1" role="listbox" aria-activedescendant={current.id}>
                    {options.map((agent) => (
                      <li key={agent.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(agent.id)}
                          role="option"
                          aria-selected={agent.id === current.id}
                          className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${
                            agent.id === current.id
                              ? "border-kaisa-blue/40 bg-kaisa-blue/12 text-kaisa-blue"
                              : "border-transparent hover:border-kaisa-purple/30 hover:bg-kaisa-purple/10"
                          }`}
                        >
                          <Image
                            src={agent.icon}
                            alt={agent.displayName}
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-kaisa-midnight/60">
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
          </div>
        )}
        <div className="hidden items-center gap-4 rounded-3xl bg-white px-4 py-3 text-sm text-kaisa-midnight shadow-[0_10px_38px_-24px_rgba(37,56,88,0.45)] md:flex">
          <div className="flex flex-col">
            <span>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</span>
          </div>
          {/* <div className="h-8 w-px bg-kaisa-midnight/10" /> */}
        </div>
      </div>
    </header>
  );
};
