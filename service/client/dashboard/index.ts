import { serviceClient } from "@/service/base/axios_client";
import {
  ActionRequiredItem,
  ActiveJobsResponse,
  LifetimeSummaryData,
  QuotingJobsResponse,
  UpcomingDeadlineItem,
} from "@/types/client/dashboard/dashboard-types";
import {
  ServiceResponse,
  PaginationMeta,
  ServiceResult,
} from "@/types/service-response";

// total jobs
export async function getActiveJobsTotal(): Promise<number> {
  try {
    const res = await serviceClient.get<
      ServiceResponse<ActiveJobsResponse, PaginationMeta>
    >("/client/dashboard/active-jobs?page=1&limit=1");

    return res.data.meta?.total ?? 0;
  } catch (error) {
    console.error("getActiveJobsTotal failed:", error);
    return 0;
  }
}

// lifetime summary
export async function getLifetimeSummary(): Promise<LifetimeSummaryData> {
  try {
    const res = await serviceClient.get<ServiceResponse<LifetimeSummaryData>>(
      "/client/lifetime-summary",
    );

    return res.data.data;
  } catch (error) {
    console.error("getLifetimeSummary failed:", error);

    return {
      totalCompleted: 0,
      totalDeclined: 0,
      topInfluencer: {
        name: "",
        totalEarned: 0,
        logo: "",
        totalJobsCompleted: 0,
        lastCompletedJobId: "",
        lastCompletedJobName: "",
        lastCompletedJobDate: "",
      },
    };
  }
}

// action required
export const getActionRequired = async (): Promise<ActionRequiredItem[]> => {
  try {
    const { data } = await serviceClient.get<
      ServiceResponse<ActionRequiredItem[]>
    >("/client/dashboard/action-required");

    return data.data ?? [];
  } catch (error) {
    console.error("getActionRequired failed:", error);
    return [];
  }
};

// upcoming deadlines
export const getUpcomingDeadlines = async (
  page = 1,
  limit = 5,
): Promise<ServiceResponse<UpcomingDeadlineItem[], PaginationMeta>> => {
  try {
    const { data } = await serviceClient.get<
      ServiceResponse<UpcomingDeadlineItem[], PaginationMeta>
    >(`/client/dashboard/upcoming-deadlines?page=${page}&limit=${limit}`);

    return data;
  } catch (error) {
    console.error("getUpcomingDeadlines failed:", error);

    return {
      success: false,
      data: [],
      meta: {
        page,
        limit,
        total: 0,
        totalPages: 1,
      },
      message: "Failed to fetch upcoming deadlines",
    };
  }
};

// pending campaigns
export const getPendingCampaigns = async (): Promise<ServiceResult<number>> => {
  try {
    const { data } = await serviceClient.get<
      ServiceResponse<QuotingJobsResponse, PaginationMeta>
    >("/campaign/my-campaigns?status=quoting");

    return {
      data: data.meta?.total ?? 0,
      error: null,
    };
  } catch (error) {
    console.error("getPendingCampaigns failed:", error);

    return {
      data: null,
      error: "Failed to load pending campaigns",
    };
  }
};
