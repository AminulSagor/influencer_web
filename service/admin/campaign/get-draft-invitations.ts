import { serviceClient } from "@/service/base/axios_client";

export const getCampaignInvitations = async (campaignId: string) => {
  // GET {{localUrl}}/campaign/admin/{{campaignId}}/invitations
  const res = await serviceClient.get(`/campaign/admin/${campaignId}/invitations`);
  return res.data;
};
