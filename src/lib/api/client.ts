"use client";

import axios, { type AxiosInstance } from "axios";
import dayjs from "dayjs";
import { getAuthStore } from "@/stores/authStore";

let apiClient: AxiosInstance | null = null;

/**
 * Returns a configured Axios instance that mirrors the interceptors from the Nuxt reference app.
 * We defer creation until first use so the store can initialise cleanly in client components.
 */
export const getApiClient = (): AxiosInstance => {
  if (apiClient) return apiClient;

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  apiClient = axios.create({
    baseURL,
  });

  apiClient.interceptors.request.use(async (config) => {
    const authStore = getAuthStore();
    const { tokenExpiration, refresh } = authStore.getState();

    if (tokenExpiration) {
      const expirationInMinutes = dayjs.unix(tokenExpiration).diff(dayjs(), "minute");
      if (expirationInMinutes < 20) {
        try {
          await refresh();
        } catch (error) {
          console.error("[API] Token refresh failed", error);
        }
      }
    }

    const updatedState = authStore.getState();
    config.headers = config.headers || {};
    if (updatedState.accessToken) {
      config.headers.Authorization = `Bearer ${updatedState.accessToken}`;
    }
    if (updatedState.idToken) {
      config.headers["x-id-token"] = updatedState.idToken;
    }

    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("[API] Response error", error);
      return Promise.reject(error);
    }
  );

  return apiClient;
};
