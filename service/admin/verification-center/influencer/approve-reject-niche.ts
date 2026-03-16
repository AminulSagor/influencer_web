import { serviceClient } from "@/service/base/axios_client";


export type VerificationActionStatus = "approved" | "rejected";

interface ApproveRejectNichePayload {
  userId: string;
  identifier: string;
  status: VerificationActionStatus;
  rejectReason?: string;
}

export const approveRejectNiche = async ({
  userId,
  identifier,
  status,
  rejectReason,
}: ApproveRejectNichePayload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/niche`,
    {
      identifier,
      status,
      ...(status === "rejected" ? { rejectReason } : {}),
    }
  );

  return res.data;
};