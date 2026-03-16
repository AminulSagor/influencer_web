import { serviceClient } from "@/service/base/axios_client";

export const getInfluencerMilstoneProgress = async (
  campaignId: string,
  influencerId: string
) => {
  const res = await serviceClient.get(
    `/campaign/progress/campaign/${campaignId}/influencer/${influencerId}`
  );
  return res.data;
};