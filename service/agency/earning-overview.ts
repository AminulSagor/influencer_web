import { serviceClient } from "@/service/base/axios_client";
import type {
    EarningOverviewResponse,
    EarningRange,
} from "@/types/agency/earning-overview";

export const getEarningOverview = async (
    range: EarningRange
): Promise<EarningOverviewResponse> => {
    const response = await serviceClient.get<EarningOverviewResponse>(
        `/agency/dashboard/earnings?range=${range}`
    );

    return response.data;
};