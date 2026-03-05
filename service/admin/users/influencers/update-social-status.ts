import { apiClient } from "@/api/base/axios_client";

export type SocialVerifyStatus = "approved" | "rejected";

export async function updateInfluencerSocialStatus(
  userId: string,
  body: {
    identifier: string; 
    status: SocialVerifyStatus;
    rejectReason?: string;
  }
) {
  return apiClient.patch(
    `/influencer/admin/verification/profile/${userId}/social`,
    body
  );
}