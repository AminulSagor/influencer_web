import { apiClient } from "@/api/base/axios_client";

export type SkillVerifyStatus = "approved" | "rejected";

export async function updateInfluencerSkillStatus(
  userId: string,
  body: {
    identifier: string; // e.g. "Modeling"
    status: SkillVerifyStatus;
    rejectReason: string;
  }
) {
  return apiClient.patch(`/influencer/admin/verification/profile/${userId}/skill`, body);
}