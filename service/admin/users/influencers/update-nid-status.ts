import { serviceClient } from "@/service/base/axios_client";

export type NidVerifyStatus = "approved" | "rejected" | "pending";

export async function updateInfluencerNidStatus(
  userId: string,
  body: { nidStatus: NidVerifyStatus }
) {
  return serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/nid`,
    body
  );
}