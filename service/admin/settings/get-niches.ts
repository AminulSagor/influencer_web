import { serviceServer } from "@/service/base/axios_server";

export type NicheItem = {
  id: string;
  name: string;
};

export const getNiches = async (): Promise<NicheItem[]> => {
  const res = await serviceServer.get("/influencer/admin/settings/niches");

  return res.data;
};