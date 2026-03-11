import { serviceClient } from "@/service/base/axios_client";

export type BinVerificationStatus = "approved" | "rejected";

interface Payload {
  userId: string;
  binStatus: BinVerificationStatus;
  rejectReason?: string;
}

export const approveRejectAgencyBin = async ({
  userId,
  binStatus,
  rejectReason,
}: Payload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/agency/${userId}/bin`,
    {
      binStatus,
      ...(binStatus === "rejected" ? { rejectReason } : {}),
    }
  );

  return res.data;
};