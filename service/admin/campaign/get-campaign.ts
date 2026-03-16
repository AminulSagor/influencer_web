import { serviceClient } from "@/service/base/axios_client";
import { GetCampaignParams, GetCampaignResponse } from "@/types/admin/campaign/get_campaign_type";

type GetAllInfluencersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const getAllCampaigns = async (
  params: GetCampaignParams = {}
): Promise<GetCampaignResponse> => {
  const res = await serviceClient.get<GetCampaignResponse>("/campaign/admin/all", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 9,
      campaignType: params.campaignType || undefined,
      status: params.status || undefined,
      search: params.search || undefined,
      clientId: params.clientId || undefined,
      startDateFrom: params.startDateFrom || undefined,
      startDateTo: params.startDateTo || undefined,
    },
  });

  return res.data;
};

export const getCampaignById = async (campaignId: string) => {
  const res = await serviceClient.get(`/influencer/admin/campaigns/${campaignId}`);
  return res.data;
};

export const getCampaignByIdFromAdmin = async (campaignId: string) => {
  const res = await serviceClient.get(`/campaign/admin/${campaignId}`);
  return res.data;
};

export const getAllInfluencer = async (params: GetAllInfluencersParams = {}) => {
  const { page = 1, limit = 100, search = "" } = params;

  const res = await serviceClient.get(`/influencer/admin/all`, {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
    },
  });

  return res.data;
};