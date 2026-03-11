import { serviceClient } from "@/service/base/axios_client";

export type VerificationActionStatus = "approved" | "rejected";

interface Payload {
  userId: string;
  identifier: string;
  status: VerificationActionStatus;
  rejectReason?: string;
}

export const approveRejectAgencyNiche = async ({
  userId,
  identifier,
  status,
  rejectReason,
}: Payload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/agency/${userId}/niche`,
    {
      identifier,
      status,
      ...(status === "rejected" ? { rejectReason } : {}),
    }
  );

  return res.data;
};