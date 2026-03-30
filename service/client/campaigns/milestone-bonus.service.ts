"use client";

import { serviceClient } from "@/service/base/axios_client";
import { ServiceResponse } from "@/types/service-response";

type ProvideMilestoneBonusParams = {
  milestoneId: string;
  campaignType: string;
  amount: number;
};

type ProvideMilestoneBonusResponse = {
  id?: string;
  amount?: number;
  message?: string;
};

export async function provideMilestoneBonus({
  milestoneId,
  campaignType,
  amount,
}: ProvideMilestoneBonusParams) {
  const normalizedCampaignType = String(campaignType ?? "").toLowerCase();

  const endpoint =
    normalizedCampaignType === "paid_ad"
      ? `/campaign/client/milestones/agency/${milestoneId}/bonus`
      : `/campaign/client/milestones/influencer/${milestoneId}/bonus`;

  const response = await serviceClient.post<
    ServiceResponse<ProvideMilestoneBonusResponse>
  >(endpoint, {
    amount,
  });

  return response.data;
}
