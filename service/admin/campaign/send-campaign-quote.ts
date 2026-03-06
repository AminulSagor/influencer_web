import { serviceClient } from "@/service/base/axios_client";

export const sendCampaignQuote = async (payload: {
  campaignId: string;
  proposedBaseBudget: number;
}) => {
  const res = await serviceClient.post("/campaign/admin/negotiation/send-quote", payload);
  return res.data;
};
