import { serviceClient } from "@/service/base/axios_client";
import { ActionRequiredResponse } from "@/types/influencer/dashboard/action_required";

export const getActionRequired = async (page = 1, limit = 5): Promise<ActionRequiredResponse> => {
    const response = await serviceClient.get(`/influencer/dashboard/actions`, {
        params: { page, limit },
    });
    return response.data;
};
