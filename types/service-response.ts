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
export type ServiceResult<T> = {
  data: T | null;
  error: string | null;
};
