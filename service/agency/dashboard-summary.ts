import { serviceClient } from "@/service/base/axios_client";
import { DashboardSummaryResponse } from "@/types/agency/dashboard-summary";

export const getDashboardSummary =
    async (): Promise<DashboardSummaryResponse> => {
        const response = await serviceClient.get<DashboardSummaryResponse>(
            "/agency/dashboard/summary"
        );

        return response.data;
    };