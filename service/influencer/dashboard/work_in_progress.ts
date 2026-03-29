import { serviceClient } from "@/service/base/axios_client";
import { WorkInProgressResponse } from "@/types/influencer/dashboard/work_in_progress";

export const getWorkInProgress = async (page = 1, limit = 5): Promise<WorkInProgressResponse> => {
    const response = await serviceClient.get(`/influencer/dashboard/work-in-progress`, {
        params: { page, limit },
    });
    return response.data;
};
