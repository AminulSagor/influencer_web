import { serviceClient } from "@/service/base/axios_client";

export type VerificationActionStatus = "approved" | "rejected";

interface Payload {
  userId: string;
  identifier: string;
  status: VerificationActionStatus;
  rejectionReason?: string;
}

export const approveRejectClientSocial = async ({
  userId,
  identifier,
  status,
  rejectionReason,
}: Payload) => {
  const res = await serviceClient.patch(
    
    `/influencer/admin/verification/client/${userId}/social`,
    {
      identifier,
      status,
      ...(status === "rejected" ? { rejectionReason } : {}),
    }
  );

  return res.data;
};