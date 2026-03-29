import { serviceClient } from "@/service/base/axios_client";

type BulkVerifyPayload = {
  userIds: string[];
  isVerified: boolean;
  reason?: string;
};

export const bulkVerifyUsers = async ({
  userIds,
  isVerified,
  reason,
}: BulkVerifyPayload) => {
  const res = await serviceClient.patch(
    "/influencer/admin/users/verification/bulk-verify",
    {
      userIds,
      isVerified,
      ...(isVerified ? {} : { reason }),
    }
  );

  return res.data;
};