export interface ApiResponse<T> {
  data:    T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data:     T[];
  total:    number;
  page:     number;
  pageSize: number;
}

export interface ApiError {
  code:    string;
  message: string;
  details: Record<string, string[]> | null;
}

export interface ListParams {
  page?:    number;
  limit?:   number;
  search?:  string;
  sortBy?:  string;
  sortDir?: 'asc' | 'desc';
}
