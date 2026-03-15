import { serviceClient } from "@/service/base/axios_client";
import type { ServiceResponse } from "@/types/service-response";
import type {
  CampaignNegotiationsData,
  NegotiationItem,
} from "@/types/client/negotiation/negotiation.types";

export async function getCampaignNegotiations(
  campaignId: string,
): Promise<NegotiationItem[]> {
  const response = await serviceClient.get<
    ServiceResponse<CampaignNegotiationsData>
  >(`/campaign/${campaignId}/negotiations`);

  return response.data.data.negotiations ?? [];
}
