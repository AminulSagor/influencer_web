import axios from "axios";
import { apiClient } from "../base/axios_client";
import { StepFourPayload, StepFourResponse } from "@/types/campaign/step4_campaign_type";

// --- Function to send Step 4 data ---
export async function submitCampaignStepFour(
  campaignId: string,
  payload: StepFourPayload
) {
  try {
    const res = await apiClient.patch<StepFourResponse>(
      `/campaign/${campaignId}/step-4`,
      payload
    );
    return res.data;
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
