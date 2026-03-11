import { serviceClient } from "@/service/base/axios_client";

export type TinVerificationStatus = "approved" | "rejected";

interface Payload {
  userId: string;
  tinStatus: TinVerificationStatus;
  rejectionReason?: string;
}

export const approveRejectClientTin = async ({
  userId,
  tinStatus,
  rejectionReason,
}: Payload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/client/${userId}/tin`,
    {
      tinStatus,
      ...(tinStatus === "rejected" ? { rejectionReason } : {}),
    }
  );

  return res.data;
};