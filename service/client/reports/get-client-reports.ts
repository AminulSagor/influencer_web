import { AxiosError } from "axios";
import {
  PaginationMeta,
  ServiceResponse,
  ServiceResult,
} from "@/types/service-response";
import {
  ClientReportsQueryParams,
  ClientReportsResponseData,
} from "@/types/client/reports/reports";
import { serviceClient } from "@/service/base/axios_client";

type ReportsApiResponse = ServiceResponse<
  ClientReportsResponseData,
  PaginationMeta
>;

export async function getClientReports(
  params: ClientReportsQueryParams,
): Promise<ServiceResult<ClientReportsResponseData, PaginationMeta>> {
  try {
    const response = await serviceClient.get<ReportsApiResponse>(
      "/client/reports",
      {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          search: params.search || undefined,
          status: params.status || undefined,
        },
      },
    );

    return {
      data: response.data.data,
      meta: response.data.meta ?? {
        total: 0,
        page: 1,
        limit: params.limit ?? 10,
        totalPages: 1,
      },
      error: null,
    };
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;

    return {
      data: null,
      meta: null,
      error:
        err.response?.data?.message || err.message || "Failed to load reports",
    };
  }
}
