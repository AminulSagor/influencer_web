import { serviceClient } from "@/service/base/axios_client";


type GetAllInfluencersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type GetCampaignParams = {
  page?: number;
  limit?: number;
  campaignType?: string;
  status?: string;
  search?: string;
  clientId?: string;
  startDateFrom?: string;
  startDateTo?: string;
};

export type AdminCampaignApiItem = {
  id: string;
  campaignName: string;
  campaignType: string;
  startingDate: string | null;
  duration: number | null;
  totalBudget: string | null;
  paymentStatus: string;
  status: string;
  isPlaced: boolean;
  placedAt: string | null;
  client?: {
    id: string;
    brandName: string;
  } | null;
  createdAt: string;
};

export type GetCampaignResponse = {
  success: boolean;
  data: AdminCampaignApiItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const getAllCampaigns = async (
  params: GetCampaignParams = {}
): Promise<GetCampaignResponse> => {
  const res = await serviceClient.get<GetCampaignResponse>("/campaign/admin/all", {
    params: {
      campaignType: "influencer_promotion",
      page: params.page ?? 1,
      limit: 9,
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
  const res = await serviceClient.get(
    `/influencer/admin/all`,
    {
      params: {
        page,
        limit,
        ...(search ? { search } : {}),
      },
    }
  );
  return res.data;
};

