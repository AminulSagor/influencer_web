import axios from "axios";
import { serviceClient } from "@/service/base/axios_client";
import type { DeleteCampaignResponse } from "@/types/campaign/delete-campaign_type";

export async function deleteCampaign(
  campaignId: string,
): Promise<DeleteCampaignResponse> {
  try {
    const response = await serviceClient.delete<DeleteCampaignResponse>(
      `/campaign/${campaignId}`,
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to delete campaign";
      const status = error.response?.status ?? 0;

      throw { status, message };
    }

    throw { status: 0, message: "Failed to delete campaign" };
  }
}
