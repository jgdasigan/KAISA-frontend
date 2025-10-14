"use client";

import { getApiClient } from "@/lib/api/client";
import type {
  GetChatMessagesResponse,
  SendExistingChatParams,
  SendNewChatParams,
} from "@/types/chat";

export const chatApi = {
  async getMessages(sessionId: string) {
    const client = getApiClient();
    const response = await client.get<GetChatMessagesResponse>(`/chat/list/${sessionId}`);
    return response.data;
  },
  async sendNewChat(payload: SendNewChatParams) {
    const client = getApiClient();
    const response = await client.post(`/chat/new`, payload);
    return response.data;
  },
  async sendExistingChat(sessionId: string, payload: SendExistingChatParams) {
    const client = getApiClient();
    const response = await client.post(`/chat/${sessionId}`, payload);
    return response.data;
  },
  async endChat(userId: string, sessionId: string) {
    const client = getApiClient();
    const response = await client.post(`/chat/end/${userId}/${sessionId}`);
    return response.data;
  },
};
