import axios from "axios";
import { serviceClient } from "@/service/base/axios_client";
import type { CampaignSummary } from "@/app/[locale]/(brand)/brand/types/client-types";
import type {
  PaginationMeta,
  ServiceResponse,
  ServiceResult,
} from "@/types/service-response";

type GetCampaignByStatusParams = {
  status: string;
  page?: number;
  limit?: number;
};

export const getCampaignByStatus = async ({
  status,
  page = 1,
  limit = 10,
}: GetCampaignByStatusParams): Promise<
  ServiceResult<CampaignSummary[], PaginationMeta>
> => {
  try {
    const { data } = await serviceClient.get<
      ServiceResponse<CampaignSummary[], PaginationMeta>
    >("/campaign/my-campaigns", {
      params: { status, page, limit },
    });

    const items = data.data ?? [];
    const meta = data.meta ?? {
      total: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit) || 1,
    };

    return {
      data: items,
      meta: {
        total: meta.total ?? items.length,
        page: meta.page ?? page,
        limit: meta.limit ?? limit,
        totalPages:
          meta.totalPages ??
          Math.ceil((meta.total ?? items.length) / (meta.limit ?? limit)) ??
          1,
      },
      error: null,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return {
          data: null,
          meta: null,
          error: "Session expired. Please login again.",
        };
      }

      return {
        data: null,
        meta: null,
        error: error.response?.data?.message ?? "Failed to load campaigns",
      };
    }

    return {
      data: null,
      meta: null,
      error: "An unexpected error occurred",
    };
  }
};