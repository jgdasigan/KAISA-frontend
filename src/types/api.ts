export type Pagination = {
  page_number?: number;
  page_size?: number;
  max_items?: number;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data: T;
};

export type ApiListResponse<T = unknown> = ApiResponse<{
  data: T[];
  pagination?: {
    last_evaluated_key: string | null;
    limit: number | null;
  };
}>;
