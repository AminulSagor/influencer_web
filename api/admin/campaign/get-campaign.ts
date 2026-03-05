import { apiClient } from "@/api/base/axios_client";

interface GetCampaignParams {
  page?: number;
  limit?: number;
  status?: string;
  clientId?: string;
  query?: string;
}

export const getAllCampaigns = async (params: GetCampaignParams) => {
  const res = await apiClient.get("/influencer/admin/campaigns", {
    params,
  });

  return res.data;
};

export const getCampaignById = async (campaignId: string) => {
  const res = await apiClient.get(`/influencer/admin/campaigns/${campaignId}`);
  return res.data;
};

export const getCampaignByIdFromAdmin = async (campaignId: string) => {
  const res = await apiClient.get(`/campaign/admin/${campaignId}`);
  return res.data;
};

export const getAllInfluencer = async () => {
  const res = await apiClient.get(`/influencer/admin/all`);
  return res.data;
};


