import { serviceClient } from "@/service/base/axios_client";
import type { VerificationActionStatus } from "./approve-reject-niche";

interface Payload {
  userId: string;
  identifier: string;
  status: VerificationActionStatus;
  rejectReason?: string;
}

export const approveRejectAgencySocial = async ({
  userId,
  identifier,
  status,
  rejectReason,
}: Payload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/agency/${userId}/social`,
    {
      identifier,
      status,
      ...(status === "rejected" ? { rejectReason } : {}),
    }
  );

  return res.data;
};