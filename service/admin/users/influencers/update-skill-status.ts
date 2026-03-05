import { serviceClient } from "@/service/base/axios_client";

export type SkillVerifyStatus = "approved" | "rejected";

export async function updateInfluencerSkillStatus(
  userId: string,
  body: {
    identifier: string; // e.g. "Modeling"
    status: SkillVerifyStatus;
    rejectReason: string;
  }
) {
  return serviceClient.patch(`/influencer/admin/verification/profile/${userId}/skill`, body);
}