import { serviceClient } from "@/service/base/axios_client";
import { Campaign } from "@/types/client/campaigns/campaign";
import { ServiceResponse } from "@/types/service-response";

export const getActiveCampaigns = async (): Promise<Campaign[]> => {
  try {
    const { data } = await serviceClient.get<ServiceResponse<Campaign[]>>(
      "/campaign/my-campaigns?status=active",
    );

    return data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch active campaigns:", error);
    return [];
  }
};
