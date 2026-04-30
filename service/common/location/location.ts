import { serviceClient } from "@/service/base/axios_client";
import type {
  GetThanasParams,
  GetZillasParams,
  LocationListResponse,
} from "@/types/common/location";

const buildLocationParams = (params?: GetZillasParams) => ({
  page: params?.page ?? 1,
  limit: params?.limit ?? 20,
  ...(params?.search?.trim() ? { search: params.search.trim() } : {}),
});

export const getZillas = async (
  params?: GetZillasParams,
): Promise<LocationListResponse> => {
  const response = await serviceClient.get<LocationListResponse>(
    "/admin/locations/zillas",
    { params: buildLocationParams(params) },
  );

  return response.data;
};

export const getThanasByZillaId = async ({
  zillaId,
  ...params
}: GetThanasParams): Promise<LocationListResponse> => {
  const response = await serviceClient.get<LocationListResponse>(
    `/admin/locations/zillas/${encodeURIComponent(zillaId)}/thanas`,
    { params: buildLocationParams(params) },
  );

  return response.data;
};
