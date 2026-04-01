import { serviceClient } from "@/service/base/axios_client";
import type { WorkInProgressResponse } from "@/types/agency/work-in-progress";

export const getWorkInProgress =
    async (): Promise<WorkInProgressResponse> => {
        const response = await serviceClient.get<WorkInProgressResponse>(
            "/agency/dashboard/work-in-progress"
        );

        return response.data;
    };