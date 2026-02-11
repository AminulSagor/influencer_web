import axios from "axios";
import { apiClient } from "../base/axios_client";

export async function requestForgotPasswordOtp(identifier: string) {
  try {
    const res = await apiClient.post(
      `/influencer/auth/forgot-password`,
      { identifier }
    );
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.message || "Failed to send OTP";
      throw new Error(msg);
    }
    throw new Error("Network error");
  }
}

// Keep verifyForgotPasswordOtp as is - it's working correctly
export async function verifyForgotPasswordOtp(identifier: string, otp: string) {
  try {
    const res = await apiClient.post(
      `/influencer/auth/forgot-password/verify-otp`,
      { identifier, otp }
    );
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.message || "Invalid OTP";
      throw new Error(msg);
    }
    throw new Error("Network error");
  }
}

export async function resetPassword(identifier: string, otp: string, newPassword: string) {
  try {
    const res = await apiClient.post(
      `/influencer/auth/reset-password`,
      { identifier, otp, newPassword}
    );
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg = err.response?.data?.message || "Failed to reset password";
      throw new Error(msg);
    }
    throw new Error("Network error");
  }
}