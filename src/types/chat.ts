import type { ApiListResponse } from "@/types/api";

export type ChatMessage = {
  session_id: string;
  timestamp: string;
  role: "user" | "assistant";
  message: string;
  user_id: string;
  file_name?: string | null;
  file_type?: string | null;
};

export type PromptResponse = {
  session_id: string;
  user_input: string;
  agent_response: string;
};

export type FileInput = {
  file_name: string;
  file_type: string;
  s3_file_name: string;
};

export type SendNewChatParams = {
  user_id: string;
  user_input: string;
  user_groups: string[];
  file_input?: FileInput;
};

export type SendExistingChatParams = {
  user_id: string;
  session_id: string;
  user_input: string;
  user_groups: string[];
  last_msg_timestamp: string;
  file_input?: FileInput;
};

export type GetChatMessagesResponse = ApiListResponse<ChatMessage>;
