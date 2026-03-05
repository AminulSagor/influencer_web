import { apiClient } from "@/api/base/axios_client";
import { ClientListItem } from "@/types/admin/user/agency-list_type";

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
};

export async function getAllClients(params?: { page?: number; limit?: number }) {
  const res = await apiClient.get(`/influencer/admin/verification/clients`, {
    params: { page: params?.page ?? 1, limit: params?.limit ?? 10 },
  });

  return res.data as {
    data: ClientListItem[];
    meta: PaginationMeta;
  };
}