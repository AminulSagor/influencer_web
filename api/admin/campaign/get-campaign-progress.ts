import { apiClient } from "@/api/base/axios_client";

export const getCampaignProgress = async (campaignId: string) => {
  try {
    const res = await apiClient.get(`/campaign/progress/${campaignId}`);
    return res.data; // backend: { success, message, data }
  } catch (err: any) {
    if (err?.response?.status === 404) return null; // ✅ endpoint not available
    throw err;
  }
};
