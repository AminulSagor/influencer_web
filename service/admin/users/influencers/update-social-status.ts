import { serviceClient } from "@/service/base/axios_client";

export type SocialVerifyStatus = "approved" | "rejected";

export async function updateInfluencerSocialStatus(
  userId: string,
  body: {
    identifier: string; 
    status: SocialVerifyStatus;
    rejectReason?: string;
  }
) {
  return serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/social`,
    body
  );
}