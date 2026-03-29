import { serviceClient } from "@/service/base/axios_client";

export interface RequestEmailOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyEmailOtpRequest {
  email: string;
  code: string;
}

export interface VerifyEmailOtpResponse {
  success: boolean;
  message: string;
}

/**
 * Request OTP for email verification
 * POST /influencer/auth/email/influencer/request-otp
 */
export const requestEmailOtp = async (): Promise<RequestEmailOtpResponse> => {
  const response = await serviceClient.post(
    `/influencer/auth/email/influencer/request-otp`,
    {}
  );
  return response.data;
};

/**
 * Verify email with OTP code
 * POST /influencer/auth/email/influencer/verify
 */
export const verifyEmailOtp = async (
  data: VerifyEmailOtpRequest
): Promise<VerifyEmailOtpResponse> => {
  const response = await serviceClient.post(
    `/influencer/auth/email/influencer/verify`,
    data
  );
  return response.data;
};
