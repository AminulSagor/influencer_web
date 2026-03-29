import { serviceClient } from "@/service/base/axios_client";
import type { LifetimeSummaryResponse } from "@/types/agency/lifetime-summary";

export const getLifetimeSummary =
    async (): Promise<LifetimeSummaryResponse> => {
        const response = await serviceClient.get<LifetimeSummaryResponse>(
            "/agency/dashboard/lifetime-summary"
        );

        return response.data;
    };