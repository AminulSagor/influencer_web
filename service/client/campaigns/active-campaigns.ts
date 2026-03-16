import { serviceServer } from "@/service/base/axios_server";
import { Campaign } from "@/types/client/campaigns/campaign";
import { ServiceResponse } from "@/types/service-response";

export const getActiveCampaigns = async (): Promise<Campaign[]> => {
  try {
    const { data } = await serviceServer.get<ServiceResponse<Campaign[]>>(
      "/campaign/my-campaigns?status=active",
    );

    return data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch active campaigns:", error);
    return [];
  }
};
