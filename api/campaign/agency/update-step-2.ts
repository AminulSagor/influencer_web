import { apiClient } from "@/api/base/axios_client";
import { StepTwoPayloadforAgency } from "@/types/campaign/step2_campaign_type";
import axios from "axios";

export class campaignServiceAgency{
      static async updateStepTwo(
    campaignId: string,
    payload: StepTwoPayloadforAgency
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.patch(`/campaign/${campaignId}/step-2`, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Failed to update Step 2";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }
}