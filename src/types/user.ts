import type { ApiListResponse } from "@/types/api";

export type UserDetails = {
  id: string;
  email: string;
  given_name: string;
  family_name: string;
  role: string;
};

export type UserGroup = {
  name: string;
};

export type UserGroupsResponse = ApiListResponse<UserGroup>;
