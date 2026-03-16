import { serviceClient } from "@/service/base/axios_client";
import { UpcomingDeadlineItem } from "@/types/client/dashboard/dashboard-types";
import { PaginationMeta, ServiceResponse } from "@/types/service-response";

export const getUpcomingDeadlinesClient = async (
  page = 1,
  limit = 5,
): Promise<ServiceResponse<UpcomingDeadlineItem[], PaginationMeta>> => {
  try {
    const { data } = await serviceClient.get<
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
