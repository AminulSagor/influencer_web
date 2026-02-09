import { OnboardingPayload } from "@/types/profile/onbording_type";
import axios from "axios";
import { apiClient } from "../base/axios_client";

export async function submitOnboarding(params: {
  token: string;
  data: OnboardingPayload;
}) {
  const { token, data } = params;

  try {
    // ✅ recommended backend route (no /client or /influencer in URL)
    return await apiClient.patch("/profile/onboarding", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg =
        (err.response?.data as { message?: string })?.message ||
        "Failed to submit onboarding";
      const status = err.response?.status ?? 0;
      throw { status, message: msg };
    }
    throw { status: 0, message: "Failed to submit onboarding" };
  }
}
