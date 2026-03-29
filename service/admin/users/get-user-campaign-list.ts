import { serviceServer } from "@/service/base/axios_server";
import { UserCampaignListResponse, UserCampaignTab, UserType } from "@/types/admin/user/user_campaign_type";

interface GetUserCampaignsParams {
  userId: string;
  userType: UserType;
  tab?: UserCampaignTab;
  page?: number;
  limit?: number;
  search?: string;
  campaignType?: string;
  startDate?: string;
  endDate?: string;
  export?: boolean;
}

export async function getUserCampaignList({
  userId,
  userType,
  tab = "all",
  page = 1,
  limit = 10,
  search,
  campaignType,
  startDate,
  endDate,
  export: exportData,
}: GetUserCampaignsParams): Promise<UserCampaignListResponse> {
  const endpointMap: Record<UserType, string> = {
    client: `/influencer/admin/user/client-campaigns/${userId}`,
    agency: `/influencer/admin/user/agency-campaigns/${userId}`,
    influencer: `/influencer/admin/user/influencer-campaigns/${userId}`,
  };

  const endpoint = endpointMap[userType];

  const res = await serviceServer.get<UserCampaignListResponse>(endpoint, {
    params: {
      tab: tab === "all" ? undefined : tab,
      page,
      limit,
      search,
      campaignType,
      startDate,
      endDate,
      export: exportData,
    },
  });

  return res.data;
}
