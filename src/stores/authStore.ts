"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserDetails } from "@/types/user";

/**
 * Auth store mirrors the Pinia auth module from the reference Nuxt app.
 * We keep the API surface minimal for now and add refresh/logout hooks later when backend is ready.
 */
export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  idToken: string | null;
  tokenExpiration: number | null;
  userDetails: UserDetails | null;
  userGroups: string[];
};

export type AuthActions = {
  setSession: (payload: Partial<AuthState>) => void;
  clearSession: () => void;
  refresh: () => Promise<void>;
};

const defaultState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  accessToken: null,
  idToken: null,
  tokenExpiration: null,
  userDetails: null,
  userGroups: [],
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...defaultState,
      setSession: (payload) => {
        set((state) => ({
          ...state,
          ...payload,
          isAuthenticated: payload.isAuthenticated ?? true,
        }));
      },
      clearSession: () => set({ ...defaultState }),
      refresh: async () => {
        // Placeholder: integrate with Amplify/Cognito refresh endpoint if needed.
        console.warn("[AuthStore] refresh() not implemented");
        return Promise.resolve();
      },
    }),
    {
      name: "kaisa-auth-store",
      version: 1,
    }
  )
);

/**
 * Convenience helper for modules that only need the store object outside React components.
 */
export const getAuthStore = () => useAuthStore;
