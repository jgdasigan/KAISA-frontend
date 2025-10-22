"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { Paperclip, SendHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";

type ChatInputProps = {
  onSubmit: (message: string, file?: File | null) => Promise<void>;
  onFileSelected?: (file: File) => void;
  isFileUploading?: boolean;
  uploadProgress?: number | null; // 0-100
  disabled?: boolean;
};

export const ChatInput = ({ onSubmit, onFileSelected, isFileUploading, uploadProgress, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [showAttachmentChip, setShowAttachmentChip] = useState(false);

  const isDisabled = disabled || isUploading;

  const doSubmit = async () => {
    if (!message.trim()) return;
    if (isUploading) return;
    setUploading(true);
    try {
      await onSubmit(message.trim(), file || undefined);
      setMessage("");
      setFile(null);
      setShowAttachmentChip(false);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await doSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-3 rounded-3xl border border-white/20 bg-white/65 p-2 shadow-[0_12px_36px_-24px_rgba(12,76,179,0.28)] backdrop-blur-xl"
      style={{ marginBottom: "4px" }}
    >
      <div className="relative">
        {showAttachmentChip && file && (
          <div className="absolute -top-13 left-1 z-10 w-[min(92%,340px)] rounded-xl border border-kaisa-blue/20 bg-white/90 px-2 py-1.5 shadow-sm">
            <div className="flex items-center gap-2">
              <Image src="/pdf.png" alt="PDF" width={16} height={16} className="h-5 w-5" />
              <span className="truncate text-xs font-medium text-kaisa-midnight">{file.name}</span>
              <span className="text-[10px] uppercase tracking-wide text-kaisa-midnight/60">PDF</span>
              <button
                type="button"
                className="text-kaisa-midnight/50"
                onClick={() => {
                  setFile(null);
                  setShowAttachmentChip(false);
                }}
                aria-label="Remove attachment"
              >
                ×
              </button>
            </div>
            {isFileUploading && (
              <div className="mt-1 h-1.5 w-full rounded-full bg-kaisa-blue/10">
                <div
                  className="h-1.5 rounded-full bg-kaisa-blue transition-[width] duration-200"
                  style={{ width: `${typeof uploadProgress === "number" ? uploadProgress : 0}%` }}
                />
              </div>
            )}
          </div>
        )}
        <textarea
          className="h-16 w-full resize-none rounded-2xl border border-transparent bg-white/85 px-3 py-2 text-sm text-kaisa-midnight outline-none transition focus:border-kaisa-blue/40 focus:bg-white"
          placeholder="Ask me anything..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void doSubmit();
            }
          }}
          disabled={isDisabled}
        />
      </div>
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
            accept="application/pdf"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0] || null;
              if (selected && selected.type !== "application/pdf") {
                // # only allow PDF files
                event.currentTarget.value = "";
                return;
              }
              setFile(selected);
              if (selected) {
                onFileSelected?.(selected);
                setShowAttachmentChip(true);
              }
            }}
            disabled={isDisabled}
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-kaisa-blue px-5 py-2 text-sm font-medium text-white transition hover:bg-kaisa-blue/90 disabled:opacity-40"
          disabled={disabled || isUploading || isFileUploading || !message.trim()}
        >
          <SendHorizontal className="h-4 w-4" />
          Send
        </button>
      </div>
    </form>
  );
};
