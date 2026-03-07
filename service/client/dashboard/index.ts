import { serviceServer } from "@/service/base/axios_server";
import {
  ActionRequiredItem,
  ActiveJobsResponse,
  LifetimeSummaryData,
  UpcomingDeadlineItem,
} from "@/types/client/dashboard/dashboard-types";
import { ServiceResponse, PaginationMeta } from "@/types/service-response";

//total jobs
export async function getActiveJobsTotal(): Promise<number> {
  const res = await serviceServer.get<
    ServiceResponse<ActiveJobsResponse, PaginationMeta>
  >("/client/dashboard/active-jobs?page=1&limit=1");

  return res.data.meta?.total ?? 0;
}

//lifetime summary
export async function getLifetimeSummary(): Promise<LifetimeSummaryData> {
  const res = await serviceServer.get<ServiceResponse<LifetimeSummaryData>>(
    "/client/lifetime-summary",
  );

  return res.data.data;
}

//action required
export const getActionRequired = async (): Promise<ActionRequiredItem[]> => {
  try {
    const { data } = await serviceServer.get<
      ServiceResponse<ActionRequiredItem[]>
    >("/client/dashboard/action-required");

    return data.data ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

//upcomming datelines
export const getUpcomingDeadlines = async (
  page = 1,
  limit = 5,
): Promise<ServiceResponse<UpcomingDeadlineItem[], PaginationMeta>> => {
  try {
    const { data } = await serviceServer.get<
      ServiceResponse<UpcomingDeadlineItem[], PaginationMeta>
    >(`/client/dashboard/upcoming-deadlines?page=${page}&limit=${limit}`);

    return data;
  } catch {
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
