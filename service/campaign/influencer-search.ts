import { apiClient } from "@/api/base/axios_client";

export interface Influencer {
  id: string;
  fullName: string;
}

// 🔍 Search Influencers
export const searchInfluencersApi = async (query: string) => {
  const res = await apiClient.get("/client/search/influencers", {
    params: { query },
  });

  return res.data || [];
};
