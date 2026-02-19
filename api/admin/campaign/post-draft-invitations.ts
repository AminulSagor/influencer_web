import { apiClient } from "@/api/base/axios_client";

export const postDraftInvitations = async (
  campaignId: string,
  influencerIds: string[]
) => {
  const uniqueIds = Array.from(new Set(influencerIds)).filter(Boolean);

  const payload = {
    campaignId,
    influencerIds: uniqueIds,
  };

  console.log("✅ ASSIGN payload:", payload);

  const res = await apiClient.post(`/campaign/admin/assign`, payload);
  return res.data;
};
