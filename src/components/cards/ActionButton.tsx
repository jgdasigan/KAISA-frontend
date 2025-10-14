"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

type ActionButtonProps = {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
};

export const ActionButton = ({ icon: Icon, label, href, onClick, variant = "primary" }: ActionButtonProps) => {
  const className = cn(
    "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors",
    variant === "primary"
      ? "bg-kaisa-yellow text-kaisa-midnight hover:bg-kaisa-yellow/90"
      : "bg-white/20 text-kaisa-midnight hover:bg-white/40"
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
};
