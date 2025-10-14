"use client";

import { getApiClient } from "@/lib/api/client";
import type { ChatHistoryResponse } from "@/types/chatHistory";

export const chatHistoryApi = {
  async getUserSessions(userId: string) {
    const client = getApiClient();
    const response = await client.get<ChatHistoryResponse>(`/sessions/list/${userId}`);
    return response.data;
  },
};
