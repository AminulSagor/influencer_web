import { serviceClient } from "@/service/base/axios_client";

export type CampaignNiche = {
  id: string;
  name: string;
};

export const getCampaignNiches = async (): Promise<CampaignNiche[]> => {
  const response = await serviceClient.get<CampaignNiche[]>(
    "/campaign/get/niches",
  );
  return response.data;
};

export const addClientProfileNiches = async (niches: string[]) => {
  const response = await serviceClient.patch("/client/profile/niches", {
    niches,
  });

  return response.data;
};

export const deleteClientProfileNiche = async (niche: string) => {
  const response = await serviceClient.delete("/client/profile/niches", {
    data: { niche },
  });

  return response.data;
};
