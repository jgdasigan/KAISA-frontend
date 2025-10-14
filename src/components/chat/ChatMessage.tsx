"use client";

import MarkdownIt from "markdown-it";
import { useMemo } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

const md = new MarkdownIt({ breaks: true, html: true });

export type ChatMessageProps = {
  message: ChatMessageType;
  isOwn: boolean;
};

export const ChatMessage = ({ message, isOwn }: ChatMessageProps) => {
  const html = useMemo(() => md.render(message.message), [message.message]);

  return (
    <div className={clsx("flex w-full gap-4", isOwn ? "justify-end" : "justify-start")}
    >
      {!isOwn && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
          <Image src="/kaisa-mark.svg" alt="KAISA" width={32} height={32} />
        </div>
      )}
      <div
        className={clsx(
          "max-w-lg rounded-3xl px-5 py-3 text-sm leading-relaxed",
          isOwn
            ? "bg-kaisa-blue text-white shadow-[0_12px_32px_-16px_rgba(12,76,179,0.75)]"
            : "bg-white/70 text-kaisa-midnight shadow-[0_12px_32px_-16px_rgba(10,17,38,0.35)]"
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {isOwn && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kaisa-blue/20 text-kaisa-blue">
          {message.user_id?.slice(0, 2).toUpperCase() || "ME"}
        </div>
      )}
    </div>
  );
};
