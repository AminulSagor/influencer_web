import { serviceClient } from "@/service/base/axios_client";
import type { EarningSummaryResponse } from "@/types/agency/earning-summary";

export const getEarningSummary =
    async (): Promise<EarningSummaryResponse> => {
        const response = await serviceClient.get<EarningSummaryResponse>(
            "/agency/dashboard/earnings-summary"
        );

        return response.data;
    };