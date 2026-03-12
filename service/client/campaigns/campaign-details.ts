import { AxiosError } from "axios";
import { serviceServer } from "@/service/base/axios_server";
import { redirect } from "next/navigation";
import { ServiceResponse } from "@/types/service-response";
import { CampaignDetails } from "@/types/client/campaigns/campaign-details";
import { ClientCampaignDetailsResponse } from "@/types/client/campaigns/campaign-submission.types";

export const getCampaignDetails = async (
  id: string,
): Promise<CampaignDetails | null> => {
  try {
    const { data } = await serviceServer.get<ServiceResponse<CampaignDetails>>(
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

export const getClientCampaignDetails = async (
  id: string,
): Promise<ClientCampaignDetailsResponse | null> => {
  try {
    const { data } = await serviceServer.get<
      ServiceResponse<ClientCampaignDetailsResponse>
    >(`/campaign/client/details/${id}`);

    if (data?.success) {
      return data.data ?? null;
    }

    return null;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        redirect("/login");
      }
      console.error(
        "Axios error fetching client campaign details:",
        error.message,
      );
    } else {
      console.error(
        "Unexpected error fetching client campaign details:",
        error,
      );
    }

    return null;
  }
};
