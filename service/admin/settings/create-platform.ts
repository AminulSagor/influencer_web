import { serviceClient } from "@/service/base/axios_client";

export type CreatePlatformPayload = {
  name: string;
};

export type CreatePlatformResponse = {
  success: boolean;
  id: string;
  message: string;
};

export const createPlatform = async (
  payload: CreatePlatformPayload
): Promise<CreatePlatformResponse> => {
  const res = await serviceClient.post(
    "/influencer/admin/settings/platform",
    payload
  );

  return res.data;
};
