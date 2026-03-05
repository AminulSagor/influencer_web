import { serviceClient } from "@/service/base/axios_client";

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetAllAgenciesParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getAllAgencies(params: GetAllAgenciesParams = {}) {
  const { page = 1, limit = 10, search } = params;

  const res = await serviceClient.get(`/influencer/admin/agencies`, {
    params: { page, limit, search },
  });

  return res.data as {
    message?: string;
    meta: PaginatedMeta;
    data: any[];
  };
}