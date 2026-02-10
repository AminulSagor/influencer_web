// api/onboarding.ts
import axios from "axios";
import { apiClient } from "../base/axios_client";
import { OnboardingPayload } from "@/types/onboarding/onboarding_payload_type";

export async function submitOnboarding(
  userType: string | null,
  payload: OnboardingPayload,
  token: string | null
) {
  try {
    // Debug: Log the payload
    console.log("🚀 Sending payload to API:", JSON.stringify(payload, null, 2));
    
    const res = await apiClient.patch(
      `/${userType}/profile/onboarding`,
      payload,
      {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
    );
    return res;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg =
        (err.response?.data as { message?: string })?.message ||
        "Something went wrong";
      const status = err.response?.status ?? 0;
      throw { status, message: msg };
    }
    throw { status: 0, message: "Something went wrong" };
  }
}