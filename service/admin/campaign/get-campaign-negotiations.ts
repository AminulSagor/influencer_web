import { serviceClient } from "@/service/base/axios_client";

export type CampaignNegotiationItem = {
  id: string;
  sender: "admin" | "client" | string;
  action: "request" | "counter_offer" | string;
  message: string | null;
  proposedBaseBudget: string | number | null;
  proposedTotalBudget: string | number | null;
  isRead: boolean;
  createdAt: string;
};

export type CampaignNegotiationMeta = {
  id: string;
  campaignName: string;
  status: string;
  negotiationTurn: "admin" | "client" | string;
  yourTurn: boolean;
};

export type CampaignNegotiationsResponse = {
  success: boolean;
  data: {
    campaign: CampaignNegotiationMeta;
    negotiations: CampaignNegotiationItem[];
  };
};

export async function getCampaignNegotiations(campaignId: string) {
  if (!campaignId) throw new Error("Campaign id is required");

  const res = await serviceClient.get<CampaignNegotiationsResponse>(
    `/campaign/admin/${campaignId}/negotiations`
  );

  return res.data;
}