import axios from "axios";
import { serviceClient } from "@/service/base/axios_client";
import type { StepTwoPayloadForAgency } from "@/types/campaign/step2_campaign_type";

export class CampaignServiceAgency {
  static async updateStepTwo(
    campaignId: string,
    payload: StepTwoPayloadForAgency,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await serviceClient.patch<{
        success: boolean;
        message: string;
      }>(`/campaign/${campaignId}/step-2`, payload);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to update Step 2";

        throw new Error(message);
      }

      throw new Error("An unexpected error occurred");
    }
  }
}