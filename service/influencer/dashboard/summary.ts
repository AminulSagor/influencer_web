import { serviceClient } from "@/service/base/axios_client";
import { DashboardSummary } from "@/types/influencer/dashboard/summary";

export const getDashboardSummary = async () : Promise<DashboardSummary> => {
    const response = await serviceClient.get('/campaign/influencer/dashboard/summary')
    return response.data.data;
}