import { serviceClient } from "@/service/base/axios_client";

export type AssignInfluencersPayload = {
  campaignId: string;
  influencerIds: string[];
};

export async function assignCampaignInfluencers(payload: AssignInfluencersPayload) {
  return serviceClient.post("/campaign/admin/assign", payload);
}

export async function fetchCampaignInvitations(campaignId: string) {
  return serviceClient.get(`/campaign/admin/${campaignId}/invitations`);
}