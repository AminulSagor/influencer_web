import { serviceClient } from "@/service/base/axios_client";
import type { UpcomingDeadlinesResponse } from "@/types/agency/upcoming-deadlines";

export const getUpcomingDeadlines =
    async (): Promise<UpcomingDeadlinesResponse> => {
        const response = await serviceClient.get<UpcomingDeadlinesResponse>(
            "/agency/dashboard/deadlines?page=1&limit=5"
        );

        return response.data;
    };