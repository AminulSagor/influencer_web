import { apiClient } from "@/api/base/axios_client";
import { GetAllAgenciesResponse } from "@/types/admin/campaign/agency/get_all_agencies_type";

export async function getAllAgencies() {
  const res = await apiClient.get<GetAllAgenciesResponse>(`/influencer/admin/agencies`);
  return res.data;
}