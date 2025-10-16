"use client";

import { create } from "zustand";
import type { ChatMessage } from "@/types/chat";

export type ChatState = {
  messages: ChatMessage[];
  isLoading: boolean;
  sessionStarted: boolean;
};

export type ChatActions = {
  setMessages: (messages: ChatMessage[]) => void;
  appendMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (text: string) => void;
  setLoading: (value: boolean) => void;
  clear: () => void;
  setSessionStarted: (value: boolean) => void;
};

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  sessionStarted: false,
};

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  ...initialState,
  setMessages: (messages) => set({ messages }),
  appendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastAssistantMessage: (text) =>
    set((state) => {
      const messages = [...state.messages];
      const lastIdx = messages.map((msg) => msg.role).lastIndexOf("assistant");
      if (lastIdx !== -1) {
        messages[lastIdx] = { ...messages[lastIdx], message: text };
      }
      return { messages };
    }),
  setLoading: (value) => set({ isLoading: value }),
  clear: () => set({ ...initialState }),
  setSessionStarted: (value) => set({ sessionStarted: value }),
}));
