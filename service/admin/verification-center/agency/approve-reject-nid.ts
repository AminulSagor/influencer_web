import { serviceClient } from "@/service/base/axios_client";

export type NidVerificationStatus = "approved" | "rejected";

interface Payload {
  userId: string;
  nidStatus: NidVerificationStatus;
  rejectReason?: string;
}

export const approveRejectAgencyNid = async ({
  userId,
  nidStatus,
  rejectReason,
}: Payload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/agency/${userId}/nid`,
    {
      nidStatus,
      ...(nidStatus === "rejected" ? { rejectReason } : {}),
    }
  );

  return res.data;
};