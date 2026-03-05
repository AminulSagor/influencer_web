import { apiClient } from "@/api/base/axios_client";

export type VerificationUpdateStatus = "approved" | "rejected";

export async function updateInfluencerVerificationStatus(userId: string, body: {
  status: VerificationUpdateStatus;
  rejectReason: string;
}) {
  return apiClient.patch(
    `/influencer/admin/verification/profile/${userId}/approve`,
    body
  );
}