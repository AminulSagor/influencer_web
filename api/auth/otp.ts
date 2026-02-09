import axios from "axios";
import { apiClient } from "../base/axios_client";
import { VerifyOtpPayload, VerifyOtpResponse } from "@/types/auth/otp_type";


export async function verifyOtp(payload: VerifyOtpPayload) {
  try {
    const res = await apiClient.post<VerifyOtpResponse>(
      "/influencer/auth/verify-otp-fallback",
      payload
    );
    return res;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg =
        (err.response?.data as { message?: string })?.message ||
        "OTP verification failed";
      const status = err.response?.status ?? 0;
      throw { status, message: msg };
    }
    throw { status: 0, message: "OTP verification failed" };
  }
}

export async function resendOtp(phone: string) {
  try {
    const res = await apiClient.post("/influencer/auth/resend-otp-fallback", { phone });
    return res;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg =
        (err.response?.data as { message?: string })?.message ||
        "Failed to resend OTP";
      const status = err.response?.status ?? 0;
      throw { status, message: msg };
    }
    throw { status: 0, message: "Failed to resend OTP" };
  }
}
