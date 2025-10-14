import type { ApiListResponse } from "@/types/api";

export type ChatHistorySession = {
  session_id: string;
  title: string;
  timestamp: string;
};

export type ChatHistoryResponse = ApiListResponse<ChatHistorySession>;
