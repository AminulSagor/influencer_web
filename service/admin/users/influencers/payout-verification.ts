import { serviceClient } from "@/service/base/axios_client";

export type VerificationUpdateStatus = "approved" | "rejected";

export async function updateBankPayoutStatus(
  userId: string,
  body: { accountNo: string; status: VerificationUpdateStatus }
) {
  return serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/payout/bank`,
    body
  );
}

export async function updateMobilePayoutStatus(
  userId: string,
  body: { accountNo: string; status: VerificationUpdateStatus }
) {
  return serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/payout/mobile`,
    body
  );
}