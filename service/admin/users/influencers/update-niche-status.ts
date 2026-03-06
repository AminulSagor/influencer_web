import { serviceClient } from "@/service/base/axios_client";

export type NicheUpdateStatus = "approved" | "rejected";

export type UpdateNicheStatusBody = {
  identifier: string;          // e.g. "Fashion"
  status: NicheUpdateStatus;   // "approved" | "rejected"
};

export async function updateInfluencerNicheStatus(
  userId: string,
  body: UpdateNicheStatusBody
) {
  return serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/niche`,
    body
  );
}