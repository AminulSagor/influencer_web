import axios from "axios";
import { serviceClient } from "../base/axios_client";
import { StepThreePayload, StepThreeResponse } from "@/types/campaign/step3_campaign_type";

// --- Function to send Step 3 data ---
export async function submitCampaignStepThree(
  campaignId: string,
  payload: StepThreePayload
) {
  try {
    const res = await serviceClient.patch<StepThreeResponse>(
      `/campaign/${campaignId}/step-3`,
      payload
    );
    return res.data; // Return the typed response data
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
