"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";

type PrimaryCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export const PrimaryCard = ({ title, description, children }: PrimaryCardProps) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/30",
        "backdrop-blur-3xl shadow-[0_12px_55px_-18px_rgba(12,76,179,0.45)]"
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-kaisa-blue/30 via-transparent to-transparent" />
        <div className="absolute -top-1/3 -right-1/2 h-56 w-56 rounded-full bg-kaisa-yellow/30 blur-3xl" />
      </div>
      <div className="relative space-y-5 p-12 text-kaisa-midnight">
        <header className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-kaisa-red/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-kaisa-red">
            KAISA AI
          </span>
          <h1 className="text-4xl font-bold lg:text-5xl">{title}</h1>
          <p className="max-w-2xl text-base text-kaisa-midnight/75 lg:text-lg">{description}</p>
        </header>
        {children}
      </div>
    </section>
  );
};
