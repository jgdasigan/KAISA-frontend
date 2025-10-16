"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { useAgentStore } from "@/stores/agentStore";

export const Header = () => {
  const { activeAgent } = useAgentStore();
  return (
    <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/20 px-4 py-2.5 backdrop-blur-xl md:px-8">
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
      <div className="hidden items-center gap-2 md:flex">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/40 px-3 py-1.5 text-sm text-kaisa-midnight">
          <Image
            src={activeAgent?.icon || "/images/kai.png"}
            alt={activeAgent?.displayName || "Teacher KAI"}
            width={18}
            height={18}
            className="h-4.5 w-4.5 rounded-full object-cover"
          />
          {activeAgent?.displayName || "Teacher KAI"}
        </div>
      </div>
    </header>
  );
};
