import { serviceServer } from "@/service/base/axios_server";
import { AgencyListItem } from "@/types/client/user/agency";
import { InfluencerListItem } from "@/types/client/user/influencer";
import type { PaginationMeta, ServiceResponse } from "@/types/service-response";

export const getInfluencers = async (
  page = 1,
  limit = 10,
  search = "",
): Promise<ServiceResponse<InfluencerListItem[], PaginationMeta>> => {
  const { data } = await serviceServer.get<
    ServiceResponse<InfluencerListItem[], PaginationMeta>
  >("/client/influencers", {
    params: {
      page,
      limit,
      search: search.trim() || undefined,
    },
  });

  return data;
};

export const getAgencies = async (
  page = 1,
  limit = 10,
  search = "",
): Promise<ServiceResponse<AgencyListItem[], PaginationMeta>> => {
  const { data } = await serviceServer.get<
    ServiceResponse<AgencyListItem[], PaginationMeta>
  >("/client/agencies", {
    params: {
      page,
      limit,
      search: search.trim() || undefined,
    },
  });

  return data;
};
