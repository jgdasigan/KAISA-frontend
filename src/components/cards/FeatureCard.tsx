"use client";

import { cn } from "@/utils/cn";

export type FeatureCardProps = {
  title: string;
  caption: string;
  prompt: string;
};

export const FeatureCard = ({ title, caption, prompt }: FeatureCardProps) => {
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/40 p-6",
        "backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-kaisa-yellow/60",
        "shadow-[0_18px_40px_-18px_rgba(12,76,179,0.35)]"
      )}
    >
      <header>
        <h3 className="text-lg font-semibold text-kaisa-midnight">{title}</h3>
        <p className="mt-1 text-sm text-kaisa-midnight/80">{caption}</p>
      </header>
      <footer className="mt-auto">
        <p className="rounded-xl bg-kaisa-blue/10 px-4 py-2 text-xs text-kaisa-blue">
          “{prompt}”
        </p>
      </footer>
    </article>
  );
};
