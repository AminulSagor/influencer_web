import { serviceClient } from "@/service/base/axios_client";

export type UpdatePlatformFeePayload = {
  platformFee?: number;
  vatTax?: number;
};

export const updatePlatformFee = async (
  payload: UpdatePlatformFeePayload
) => {
  const res = await serviceClient.patch(
    "/influencer/admin/settings/general",
    payload
  );

  return res.data;

  // if wrapped response:
  // return res.data.data;
};