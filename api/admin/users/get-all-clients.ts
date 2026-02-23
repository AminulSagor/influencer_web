import { apiClient } from "@/api/base/axios_client";

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetAllBrandsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getAllBrands(params: GetAllBrandsParams = {}) {
  const { page = 1, limit = 10, search } = params;

  const res = await apiClient.get(`/influencer/admin/verification/clients`, {
    params: { page, limit, search },
  });

  return res.data as {
    message?: string;
    meta: PaginatedMeta;
    data: any[];
  };
}