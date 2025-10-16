"use client";

import { create } from "zustand";

type AgentInfo = {
  id: string;
  displayName: string;
  apiKey?: string;
  icon: string;
};

type AgentStoreState = {
  activeAgent?: AgentInfo;
  setActiveAgent: (agent: AgentInfo) => void;
  clearAgent: () => void;
};

export const useAgentStore = create<AgentStoreState>((set) => ({
  activeAgent: undefined,
  setActiveAgent: (agent) => set({ activeAgent: agent }),
  clearAgent: () => set({ activeAgent: undefined }),
}));


