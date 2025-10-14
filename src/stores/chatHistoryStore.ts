"use client";

import { create } from "zustand";
import type { ChatHistorySession } from "@/types/chatHistory";

export type ChatHistoryState = {
  sessions: ChatHistorySession[];
  isLoading: boolean;
};

export type ChatHistoryActions = {
  setSessions: (sessions: ChatHistorySession[]) => void;
  setLoading: (value: boolean) => void;
  clear: () => void;
};

const initialState: ChatHistoryState = {
  sessions: [],
  isLoading: false,
};

export const useChatHistoryStore = create<ChatHistoryState & ChatHistoryActions>((set) => ({
  ...initialState,
  setSessions: (sessions) => set({ sessions }),
  setLoading: (value) => set({ isLoading: value }),
  clear: () => set({ ...initialState }),
}));
