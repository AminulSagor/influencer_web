import { serviceClient } from "@/service/base/axios_client";

export const deleteCampaign = async (campaignId: string) => {
  const res = await serviceClient.delete(`/campaign/${campaignId}`);
  return res.data;
};
