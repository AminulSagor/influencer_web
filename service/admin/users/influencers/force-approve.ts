import { serviceClient } from "@/service/base/axios_client";

export type VerificationUpdateStatus = "approved" | "rejected";

export async function updateInfluencerVerificationStatus(userId: string, body: {
  status: VerificationUpdateStatus;
  rejectReason: string;
}) {
  return serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/approve`,
    body
  );
}