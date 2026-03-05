import { apiClient } from "@/api/base/axios_client";

export const sendCampaignQuote = async (payload: {
  campaignId: string;
  proposedBaseBudget: number;
}) => {
  const res = await apiClient.post("/campaign/admin/negotiation/send-quote", payload);
  return res.data;
};
