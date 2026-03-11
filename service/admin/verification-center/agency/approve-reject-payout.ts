import { serviceClient } from "@/service/base/axios_client";

export type VerificationActionStatus = "approved" | "rejected";
export type AgencyPayoutType = "bank" | "mobile";

interface Payload {
  userId: string;
  payoutType: AgencyPayoutType;
  accountNo: string;
  status: VerificationActionStatus;
  rejectReason?: string;
}

export const approveRejectAgencyPayout = async ({
  userId,
  payoutType,
  accountNo,
  status,
  rejectReason,
}: Payload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/agency/${userId}/payout/${payoutType}`,
    {
      accountNo,
      status,
      ...(status === "rejected" ? { rejectReason } : {}),
    }
  );

  return res.data;
};