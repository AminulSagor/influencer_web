import { serviceClient } from "@/service/base/axios_client";

export type TradeLicenseVerificationStatus = "approved" | "rejected";

interface Payload {
  userId: string;
  tradeLicenseStatus: TradeLicenseVerificationStatus;
  rejectReason?: string;
}

export const approveRejectAgencyTradeLicense = async ({
  userId,
  tradeLicenseStatus,
  rejectReason,
}: Payload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/agency/${userId}/trade-license`,
    {
      tradeLicenseStatus,
      ...(tradeLicenseStatus === "rejected" ? { rejectReason } : {}),
    }
  );

  return res.data;
};