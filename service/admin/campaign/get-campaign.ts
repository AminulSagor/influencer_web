import { serviceClient } from "@/service/base/axios_client";

interface GetCampaignParams {
  page?: number;
  limit?: number;
  status?: string;
  clientId?: string;
  query?: string;
}

export const getAllCampaigns = async (params: GetCampaignParams) => {
  const res = await serviceClient.get("/influencer/admin/campaigns", {
    params,
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

export const getAllInfluencer = async () => {
  const res = await serviceClient.get(`/influencer/admin/all`);
  return res.data;
};


