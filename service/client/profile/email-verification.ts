import { serviceClient } from "@/service/base/axios_client";

export type VerifyClientEmailPayload = {
  email: string;
  code: string;
};

export const requestClientEmailOtp = async () => {
  const response = await serviceClient.post(
    "/influencer/auth/email/client/request-otp",
    {},
  );

  return response.data;
};

export const verifyClientEmailOtp = async (
  payload: VerifyClientEmailPayload,
) => {
  const response = await serviceClient.post(
    "/influencer/auth/email/client/verify",
    payload,
  );

  return response.data;
};
