import { serviceClient } from "@/service/base/axios_client";

export type TinVerificationStatus = "approved" | "rejected";

interface Payload {
  userId: string;
  tinStatus: TinVerificationStatus;
  rejectReason?: string;
}

export const approveRejectAgencyTin = async ({
  userId,
  tinStatus,
  rejectReason,
}: Payload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/agency/${userId}/tin`,
    {
      tinStatus,
      ...(tinStatus === "rejected" ? { rejectReason } : {}),
    }
  );

  return res.data;
};