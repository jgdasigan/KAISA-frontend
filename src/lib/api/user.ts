"use client";

import { getApiClient } from "@/lib/api/client";
import type { UserGroupsResponse } from "@/types/user";

export const userApi = {
  async getGroupsForUser(userId: string, params: Record<string, unknown>) {
    const client = getApiClient();
    const response = await client.get<UserGroupsResponse>(`/user/groups/${userId}`, {
      params,
    });
    return response.data;
  },
};
