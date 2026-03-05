import { apiClient } from "@/api/base/axios_client";

export type NicheUpdateStatus = "approved" | "rejected";

export type UpdateNicheStatusBody = {
  identifier: string;          // e.g. "Fashion"
  status: NicheUpdateStatus;   // "approved" | "rejected"
};

export async function updateInfluencerNicheStatus(
  userId: string,
  body: UpdateNicheStatusBody
) {
  return apiClient.patch(
    `/influencer/admin/verification/profile/${userId}/niche`,
    body
  );
}