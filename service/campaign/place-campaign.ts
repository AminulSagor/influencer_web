// service/campaign/place.ts
import axios from "axios";
import { serviceClient } from "../base/axios_client";
import { PlaceCampaignResponse } from "@/types/campaign/place-campaign_type";

export async function placeCampaign(campaignId: string): Promise<PlaceCampaignResponse> {
  try {
    const res = await serviceClient.post<PlaceCampaignResponse>(`/campaign/${campaignId}/place`);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg = (err.response?.data as { message?: string })?.message || "Something went wrong";
      const status = err.response?.status ?? 0;
      throw { status, message: msg };
    }
    throw { status: 0, message: "Something went wrong" };
  }
}
