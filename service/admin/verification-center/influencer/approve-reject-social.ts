import { serviceClient } from "@/service/base/axios_client";
import type { VerificationActionStatus } from "./approve-reject-niche";

interface ApproveRejectSocialPayload {
  userId: string;
  identifier: string;
  status: VerificationActionStatus;
  rejectReason?: string;
}

export const approveRejectSocial = async ({
  userId,
  identifier,
  status,
  rejectReason,
}: ApproveRejectSocialPayload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/social`,
    {
      identifier,
      status,
      ...(status === "rejected" ? { rejectReason } : {}),
    }
  );

  return res.data;
};