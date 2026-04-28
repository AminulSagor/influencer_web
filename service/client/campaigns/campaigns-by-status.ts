import axios from "axios";
import { serviceClient } from "@/service/base/axios_client";
import type {
  PaginationMeta,
  ServiceResponse,
  ServiceResult,
} from "@/types/service-response";
import type { CampaignOverView } from "@/types/client/campaigns/campaign-overview";
import type { CampaignSortValue } from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/campaign-list-utils";

type GetCampaignByStatusParams = {
  status: string;
  page?: number;
  limit?: number;
  search?: string;
  sort?: CampaignSortValue;
};

export const getCampaignByStatus = async ({
  status,
  page = 1,
  limit = 10,
  search,
  sort,
}: GetCampaignByStatusParams): Promise<
  ServiceResult<CampaignOverView[], PaginationMeta>
> => {
  try {
    const { data } = await serviceClient.get<
      ServiceResponse<CampaignOverView[], PaginationMeta>
    >("/campaign/my-campaigns", {
      params: {
        status,
        page,
        limit,
        ...(search?.trim() ? { search: search.trim() } : {}),
        ...(sort ? { sort } : {}),
      },
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