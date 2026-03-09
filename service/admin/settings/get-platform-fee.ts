import { serviceServer } from "@/service/base/axios_server";

export type GeneralSettingsResponse = {
  platformFee: string | number;
  vatTax: string | number;
};

export const getPlatformFee = async (): Promise<GeneralSettingsResponse> => {
  const res = await serviceServer.get("/influencer/admin/settings/general");

  // if backend returns direct object
  return res.data;

  // if backend returns { success, data }
  // return res.data.data;
};