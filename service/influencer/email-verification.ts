import { serviceClient } from "@/service/base/axios_client";

export type VerifyInfluencerEmailPayload = {
  email: string;
  code: string;
};

export const requestInfluencerEmailOtp = async () => {
  const response = await serviceClient.post(
    "/influencer/auth/email/influencer/request-otp",
    {},
  );

  return response.data;
};

export const verifyInfluencerEmailOtp = async (
  payload: VerifyInfluencerEmailPayload,
) => {
  const response = await serviceClient.post(
    "/influencer/auth/email/influencer/verify",
    payload,
  );

  return response.data;
};
