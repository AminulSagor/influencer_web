import { apiClient } from "@/api/base/axios_client";
import { InfluencerListItem } from "@/types/admin/user/influencer-list_type";

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getAllInfluencers(params?: { page?: number; limit?: number }) {
  const res = await apiClient.get(`/influencer/admin/browsing/influencers`, {
    params: { page: params?.page ?? 1, limit: params?.limit ?? 10 },
  });

  return res.data as {
    data: InfluencerListItem[];
    meta: PaginationMeta;
  };
}