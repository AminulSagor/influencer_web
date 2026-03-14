import { serviceClient } from "@/service/base/axios_client";

export const getCampaignAssignments = async (campaignId: string) => {
  const res = await serviceClient.get(
    `/campaign/admin/get/${campaignId}/assignments`
  );
  return res.data;
};