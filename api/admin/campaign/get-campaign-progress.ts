import { apiClient } from "@/api/base/axios_client";

export type CampaignProgressRes = {
  success: boolean;
  message: string;
  data: {
    campaignId: string;
    campaignStatus: string;          // e.g. "cancelled"
    operationalProgress: string;     // e.g. "0%"
  };
};

export async function getCampaignProgress(campaignId: string) {
  const res = await apiClient.get<CampaignProgressRes>(`/campaign/progress/${campaignId}`);
  return res.data;
}
