import { serviceClient } from "@/service/base/axios_client";

export type VerificationActionStatus = "approved" | "rejected";
export type PayoutType = "bank" | "mobile";

interface ApproveRejectPayoutPayload {
  userId: string;
  payoutType: PayoutType;
  accountNo: string;
  status: VerificationActionStatus;
  rejectReason?: string;
}

export const approveRejectPayout = async ({
  userId,
  payoutType,
  accountNo,
  status,
  rejectReason,
}: ApproveRejectPayoutPayload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/payout/${payoutType}`,
    {
      accountNo,
      status,
      ...(status === "rejected" ? { rejectReason } : {}),
    }
  );

  return res.data;
};