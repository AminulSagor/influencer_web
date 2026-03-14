import { serviceClient } from "@/service/base/axios_client";
import type { VerificationActionStatus } from "./approve-reject-niche";

interface ApproveRejectSkillPayload {
  userId: string;
  identifier: string;
  status: VerificationActionStatus;
  rejectReason?: string;
}

export const approveRejectSkill = async ({
  userId,
  identifier,
  status,
  rejectReason,
}: ApproveRejectSkillPayload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/skill`,
    {
      identifier,
      status,
      ...(status === "rejected" ? { rejectReason } : {}),
    }
  );

  return res.data;
};