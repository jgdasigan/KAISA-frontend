"use client";

import { create } from "zustand";
import type { AgentProfile } from "@/data/agents";

type AgentStoreState = {
  activeAgent?: AgentProfile;
  setActiveAgent: (agent: AgentProfile) => void;
  clearAgent: () => void;
};

export const useAgentStore = create<AgentStoreState>((set) => ({
  activeAgent: undefined,
  setActiveAgent: (agent) => set({ activeAgent: agent }),
  clearAgent: () => set({ activeAgent: undefined }),
}));


