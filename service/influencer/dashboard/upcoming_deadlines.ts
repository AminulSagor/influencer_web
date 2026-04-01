import { serviceClient } from "@/service/base/axios_client";
import { UpcomingDeadlinesResponse } from "@/types/influencer/dashboard/upcoming_deadlines";

export const getUpcomingDeadlines = async (page = 1, limit = 5): Promise<UpcomingDeadlinesResponse> => {
    const response = await serviceClient.get(`/influencer/dashboard/deadlines`, {
        params: { page, limit },
    });
    return response.data;
};
