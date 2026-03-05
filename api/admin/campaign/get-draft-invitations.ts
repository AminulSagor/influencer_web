import { apiClient } from "@/api/base/axios_client";

export const getCampaignInvitations = async (campaignId: string) => {
  // GET {{localUrl}}/campaign/admin/{{campaignId}}/invitations
  const res = await apiClient.get(`/campaign/admin/${campaignId}/invitations`);
  return res.data;
};
