// app/api/admin/campaign/assignment-remain.ts
import { apiClient } from "@/api/base/axios_client";

export type RemainingInvitationInfluencer = {
  id: string;
  assignmentId: string; // ✅ IMPORTANT (per influencer)
  name: string;
  offeredAmount: number;
  percentage: number;
};

export type RemainingInvitationsResponse = {
  success: boolean;
  data: {
    campaignId: string;
    draftCount: number;
    draftedInfluencers: RemainingInvitationInfluencer[];
    remainingBudget: number;
  };
};

export async function fetchRemainingInvitations(
  campaignId: string
): Promise<RemainingInvitationsResponse> {
  const res = await apiClient.get(
    `/campaign/admin/assignment/${campaignId}/remain`
  );
  return res.data;
}