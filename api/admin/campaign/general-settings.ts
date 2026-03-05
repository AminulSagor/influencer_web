import { apiClient } from "@/api/base/axios_client";

export type GeneralSettingsResponse = {
  success?: boolean;
  data?: {
    platformFee?: string | number; // backend returns "2"
    vatTax?: string | number;
  };
  platformFee?: string | number; // if backend returns flat
  vatTax?: string | number;
};

export async function getGeneralSettings() {
  // GET /influencer/admin/settings/general
  return apiClient.get<GeneralSettingsResponse>("/influencer/admin/settings/general");
}

export async function patchGeneralSettings(payload: { platformFee: number }) {
  // PATCH /influencer/admin/settings/general
  return apiClient.patch("/influencer/admin/settings/general", payload);
}