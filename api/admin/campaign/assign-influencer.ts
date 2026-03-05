import { apiClient } from "@/api/base/axios_client";

export type AssignInfluencersPayload = {
  campaignId: string;
  influencerIds: string[];
};

export async function assignCampaignInfluencers(payload: AssignInfluencersPayload) {
  return apiClient.post("/campaign/admin/assign", payload);
}

export async function fetchCampaignInvitations(campaignId: string) {
  return apiClient.get(`/campaign/admin/${campaignId}/invitations`);
}