import { serviceClient } from "@/service/base/axios_client";

export type CreateNichePayload = {
  name: string;
};

export type CreateNicheResponse = {
  success: boolean;
  id: string;
  message: string;
};

export const createNiche = async (
  payload: CreateNichePayload
): Promise<CreateNicheResponse> => {
  const res = await serviceClient.post(
    "/influencer/admin/settings/niches",
    payload
  );

  return res.data;
};