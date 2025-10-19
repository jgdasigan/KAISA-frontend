"use client";

import { FormEvent, useState } from "react";
import { Paperclip, SendHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";

type ChatInputProps = {
  onSubmit: (message: string, file?: File | null) => Promise<void>;
  disabled?: boolean;
};

export const ChatInput = ({ onSubmit, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setUploading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;
    setUploading(true);
    try {
      await onSubmit(message.trim(), file || undefined);
      setMessage("");
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const isDisabled = disabled || isUploading;

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-3 rounded-3xl border border-white/20 bg-white/65 p-2 shadow-[0_12px_36px_-24px_rgba(12,76,179,0.28)] backdrop-blur-xl"
      style={{ marginBottom: "4px" }}
    >
      <textarea
        className="h-16 w-full resize-none rounded-2xl border border-transparent bg-white/85 px-3 py-2 text-sm text-kaisa-midnight outline-none transition focus:border-kaisa-blue/40 focus:bg-white"
        placeholder="Ask me anything..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        disabled={isDisabled}
      />
      <div className="flex items-center justify-between gap-3">
        <label
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-xs font-medium text-kaisa-midnight",
            isDisabled && "pointer-events-none opacity-60"
          )}
        >
          <Paperclip className="h-4 w-4" />
          Attach a document
          <input
            type="file"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0];
              if (selected) {
                setFile(selected);
              }
            }}
            disabled={isDisabled}
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-kaisa-blue px-5 py-2 text-sm font-medium text-white transition hover:bg-kaisa-blue/90 disabled:opacity-40"
          disabled={disabled || isUploading || !message.trim()}
        >
          <SendHorizontal className="h-4 w-4" />
          Send
        </button>
      </div>
    </form>
  );
};
