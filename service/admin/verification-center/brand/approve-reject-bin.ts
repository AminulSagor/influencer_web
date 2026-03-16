import { serviceClient } from "@/service/base/axios_client";

export type BinVerificationStatus = "approved" | "rejected";

interface Payload {
  userId: string;
  binStatus: BinVerificationStatus;
  rejectionReason?: string;
}

export const approveRejectClientBin = async ({
  userId,
  binStatus,
  rejectionReason,
}: Payload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/client/${userId}/bin`,
    {
      binStatus,
      ...(binStatus === "rejected" ? { rejectionReason } : {}),
    }
  );

  return res.data;
};