import { serviceClient } from "@/service/base/axios_client";
import { LifetimeSummary } from "@/types/influencer/dashboard/lifetime_summary";

export const getLifetimeSummary = async (): Promise<LifetimeSummary> => {
    const response = await serviceClient.get(`/influencer/dashboard/lifetime-summary`);
    return response.data.data;
};
