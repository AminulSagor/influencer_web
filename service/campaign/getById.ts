// service/campaign/getById.ts

import { GetCampaignResponse } from "@/types/campaign/get_campaign_type";
import { serviceClient } from "../base/axios_client";
import axios from "axios";

export async function getCampaignById(campaignId: string): Promise<GetCampaignResponse> {
  try {
    const res = await serviceClient.get<GetCampaignResponse>(`/campaign/${campaignId}`);
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
