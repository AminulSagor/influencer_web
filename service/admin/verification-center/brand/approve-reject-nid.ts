import { serviceClient } from "@/service/base/axios_client";

export type NidVerificationStatus = "approved" | "rejected";

interface Payload {
  userId: string;
  nidStatus: NidVerificationStatus;
  rejectionReason?: string;
}

export const approveRejectClientNid = async ({
  userId,
  nidStatus,
  rejectionReason,
}: Payload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/client/${userId}/nid`,
    {
      nidStatus,
      ...(nidStatus === "rejected" ? { rejectionReason } : {}),
    }
  );

  return res.data;
};