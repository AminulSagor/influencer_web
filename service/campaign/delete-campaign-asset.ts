import axios from "axios";
import { serviceClient } from "@/service/base/axios_client";
import type { DeleteCampaignAssetResponse } from "@/types/campaigns/delete-campaign-asset_type";

export async function deleteCampaignAsset(
  assetId: string,
): Promise<DeleteCampaignAssetResponse> {
  try {
    const response = await serviceClient.delete<DeleteCampaignAssetResponse>(
      `/campaign/asset/${assetId}`,
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Failed to delete asset";
      const status = error.response?.status ?? 0;

      throw { status, message };
    }

    throw { status: 0, message: "Failed to delete asset" };
  }
}
