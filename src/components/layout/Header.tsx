"use client";

import { Menu, Mic } from "lucide-react";
import Image from "next/image";

export const Header = () => {
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
        <div className="flex items-center gap-2">
          <Image src="/kaisa-logo.svg" alt="KAISA" width={32} height={32} />
          <span className="text-base font-semibold tracking-wide text-kaisa-midnight">KAISA</span>
        </div>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/40 px-4 py-2 text-sm text-kaisa-midnight">
          <Mic className="h-4 w-4 text-kaisa-blue" />
          Voice Input
        </div>
      </div>
    </header>
  );
};
