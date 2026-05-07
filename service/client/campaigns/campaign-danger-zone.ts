import { serviceClient } from "@/service/base/axios_client";
import { ServiceResponse } from "@/types/service-response";

type AgencyCancelRequestPayload = {
  targetType: "agency";
  agencyOfferId: string;
  reason: string;
};

type InfluencerCancelRequestPayload = {
  targetType: "influencer";
  targetId: string;
  reason: string;
};

export type CampaignCancelRequestPayload =
  | AgencyCancelRequestPayload
  | InfluencerCancelRequestPayload;

export async function submitCampaignCancelRequest(
  campaignId: string,
  payload: CampaignCancelRequestPayload,
): Promise<ServiceResponse<null>> {
  const { data } = await serviceClient.post<ServiceResponse<null>>(
    `/campaign/danger-zone/${campaignId}/cancel-request`,
    payload,
  );

  return data;
}
