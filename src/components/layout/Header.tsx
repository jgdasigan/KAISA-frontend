"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { useAgentStore } from "@/stores/agentStore";

export const Header = () => {
  const { activeAgent } = useAgentStore();
  return (
    <header className="flex items-center justify-between gap-6 border-b border-white/10 bg-white/20 px-6 py-4 backdrop-blur-xl md:px-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => console.info("TODO: toggle mobile nav")}
          className="inline-flex rounded-full border border-white/20 bg-white/30 p-2 text-kaisa-midnight transition md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="fixed top-0 left-2 z-50 flex items-center gap-2 p-3">
          <Image src="/kaisa-logo-1.png" alt="KAISA" width={62} height={62} />
          <span className="text-xl font-semibold tracking-wide text-kaisa-blue">KAISA</span>
        </div>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/40 px-4 py-2 text-sm text-kaisa-midnight">
          <Image
            src={activeAgent?.icon || "/images/kai.png"}
            alt={activeAgent?.displayName || "Teacher KAI"}
            width={20}
            height={20}
            className="h-5 w-5 rounded-full object-cover"
          />
          {activeAgent?.displayName || "Teacher KAI"}
        </div>
      </div>
    </header>
  );
};
