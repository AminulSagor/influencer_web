export type PaginationMeta = {
  total?: number;
  page: number;
  limit: number;
  totalPages?: number;
};

export type ServiceResponse<T, M = undefined> = {
  success: boolean;
  data: T;
  meta?: M;
  message?: string;
};

export type ServiceResult<T, M = undefined> = {
  data: T | null;
  meta?: M | null;
  error: string | null;
};