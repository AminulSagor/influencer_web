import { serviceClient } from "@/service/base/axios_client";

export type NidVerificationStatus = "approved" | "rejected";

interface ApproveRejectNidPayload {
  userId: string;
  nidStatus: NidVerificationStatus;
  rejectReason?: string;
}

export const approveRejectNid = async ({
  userId,
  nidStatus,
  rejectReason,
}: ApproveRejectNidPayload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/nid`,
    {
      nidStatus,
      ...(nidStatus === "rejected" ? { rejectReason } : {}),
    }
  );

  return res.data;
};