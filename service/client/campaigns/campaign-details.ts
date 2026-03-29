import { AxiosError } from "axios";
import { serviceServer } from "@/service/base/axios_server";
import type { Campaignservice } from "@/app/[locale]/(brand)/brand/types/client-types";
import { redirect } from "next/navigation";
import { ServiceResponse } from "@/types/service-response";

export const getCampaignDetails = async (
  id: string,
): Promise<Campaignservice | null> => {
  try {
    const { data } = await serviceServer.get<ServiceResponse<Campaignservice>>(
      `/campaign/${id}`,
    );

    if (data?.success) {
      return data.data ?? null;
    }

    return null;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        redirect("/login");
      }
      console.error("Axios error fetching campaign details:", error.message);
    } else {
      console.error("Unexpected error fetching campaign details:", error);
    }

    return null;
  }
};
