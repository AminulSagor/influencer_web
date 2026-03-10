import { AxiosError } from "axios";
import {
  ClientAnalyticsData,
  ClientAnalyticsQueryParams,
} from "@/types/client/analytics/analytics";
import { PaginationMeta, ServiceResponse, ServiceResult } from "@/types/service-response";
import { serviceClient } from "@/service/base/axios_client";

export async function getClientAnalytics(
  params: ClientAnalyticsQueryParams
): Promise<ServiceResult<ClientAnalyticsData, PaginationMeta>> {
  try {
    const response = await serviceClient.get<
      ServiceResponse<ClientAnalyticsData>
    >("/client/analytics", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        sortOrder: params.sortOrder ?? "high_to_low",
      },
    });

    return {
      data: response.data.data,
      meta: response.data.data.transactions.meta,
      error: null,
    };
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;

    return {
      data: null,
      meta: null,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to load analytics",
    };
  }
}