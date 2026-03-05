// api/campaign/step5.ts
import axios from "axios";
import { apiClient } from "../base/axios_client";
import { StepFivePayload, StepFiveResponse } from "@/types/campaign/step5_campaign_type";

export async function submitCampaignStepFive(
  campaignId: string,
  payload: StepFivePayload
): Promise<StepFiveResponse> {
  try {
    const res = await apiClient.patch<StepFiveResponse>(
      `/campaign/${campaignId}/step-5`,
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
