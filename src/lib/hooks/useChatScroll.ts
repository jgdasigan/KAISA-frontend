"use client";

import { useEffect, useRef } from "react";

export const useChatScroll = <T extends HTMLElement>() => {
  const containerRef = useRef<T | null>(null);

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return { containerRef, scrollToBottom };
};
