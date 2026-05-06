import { serviceClient } from "@/service/base/axios_client";

export type VerifyAgencyEmailPayload = {
  email: string;
  code: string;
};

export const requestAgencyEmailOtp = async () => {
  const response = await serviceClient.post(
    "/influencer/auth/email/agency/request-otp",
    {},
  );

  return response.data;
};

export const verifyAgencyEmailOtp = async (
  payload: VerifyAgencyEmailPayload,
) => {
  const response = await serviceClient.post(
    "/influencer/auth/email/agency/verify",
    payload,
  );

  return response.data;
};
    