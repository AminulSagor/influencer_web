import { serviceServer } from "@/service/base/axios_server";
import { AgencyListItem } from "@/types/client/user/agency";
import { InfluencerListItem } from "@/types/client/user/influencer";
import type { PaginationMeta, ServiceResponse } from "@/types/service-response";


export const getInfluencers = async (
  page = 1,
  limit = 10,
): Promise<ServiceResponse<InfluencerListItem[], PaginationMeta>> => {
  const { data } = await serviceServer.get<
    ServiceResponse<InfluencerListItem[], PaginationMeta>
  >(`/client/influencers?page=${page}&limit=${limit}`);

  return data;
};

export const getAgencies = async (
  page = 1,
  limit = 10,
): Promise<ServiceResponse<AgencyListItem[], PaginationMeta>> => {
  const { data } = await serviceServer.get<
    ServiceResponse<AgencyListItem[], PaginationMeta>
  >(`/client/agencies?page=${page}&limit=${limit}`);

  return data;
};