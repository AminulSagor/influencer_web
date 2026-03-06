import { serviceClient } from "@/service/base/axios_client";

export interface Influencer {
  id: string;
  fullName: string;
}

// 🔍 Search Influencers
export const searchInfluencersservice = async (query: string) => {
  const res = await serviceClient.get("/client/search/influencers", {
    params: { query },
  });

  return res.data || [];
};
