import axios from "axios";
import { serviceClient } from "@/service/base/axios_client";
import type {
  UploadCampaignAssetsPayload,
  UploadCampaignAssetsResponse,
} from "@/types/campaigns/upload-campaign-assets_type";

export async function uploadCampaignAssets(
  campaignId: string,
  payload: UploadCampaignAssetsPayload,
): Promise<UploadCampaignAssetsResponse> {
  try {
    const response = await serviceClient.post<UploadCampaignAssetsResponse>(
      `/campaign/${campaignId}/assets`,
      payload,
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to upload assets";
      const status = error.response?.status ?? 0;

      throw { status, message };
    }

    throw { status: 0, message: "Failed to upload assets" };
  }
}
