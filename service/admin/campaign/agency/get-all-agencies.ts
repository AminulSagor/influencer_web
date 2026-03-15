import { serviceClient } from "@/service/base/axios_client";
import { GetAllAgenciesResponse } from "@/types/admin/campaign/agency/get_all_agencies_type";

type GetAllAgenciesParams = {
  page?: number;
  limit?: number;
  search?: string;
};
export async function getAllAgencies(params: GetAllAgenciesParams = {}) {
  const { page = 1, limit = 100, search = "" } = params;

  const res = await serviceClient.get<GetAllAgenciesResponse>(
    `/influencer/admin/agencies`,
    {
      params: {
        page,
        limit,
        ...(search ? { search } : {}),
      },
    }
  );

  return res.data;
}