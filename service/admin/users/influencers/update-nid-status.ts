import { apiClient } from "@/api/base/axios_client";

export type NidVerifyStatus = "approved" | "rejected" | "pending";

export async function updateInfluencerNidStatus(
  userId: string,
  body: { nidStatus: NidVerifyStatus }
) {
  return apiClient.patch(
    `/influencer/admin/verification/profile/${userId}/nid`,
    body
  );
}