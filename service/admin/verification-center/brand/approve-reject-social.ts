import { serviceClient } from "@/service/base/axios_client";

export type VerificationActionStatus = "approved" | "rejected";

interface Payload {
  userId: string;
  url: string;
  status: VerificationActionStatus;
  rejectionReason?: string;
}

export const approveRejectClientSocial = async ({
  userId,
  url,
  status,
  rejectionReason,
}: Payload) => {
  const res = await serviceClient.patch(
    
    `/influencer/admin/verification/client/${userId}/social`,
    {
      url,
      status,
      ...(status === "rejected" ? { rejectionReason } : {}),
    }
  );

  return res.data;
};