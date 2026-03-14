import { serviceClient } from "@/service/base/axios_client";

export type TradeLicenseVerificationStatus = "approved" | "rejected";

interface Payload {
  userId: string;
  tradeLicenseStatus: TradeLicenseVerificationStatus;
  rejectionReason?: string;
}

export const approveRejectClientTradeLicense = async ({
  userId,
  tradeLicenseStatus,
  rejectionReason,
}: Payload) => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/client/${userId}/trade-license`,
    {
      tradeLicenseStatus,
      ...(tradeLicenseStatus === "rejected" ? { rejectionReason } : {}),
    }
  );

  return res.data;
};