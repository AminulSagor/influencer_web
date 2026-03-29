import { serviceClient } from "@/service/base/axios_client";
import { EarningsOverview, EarningsOverviewRange } from "@/types/influencer/dashboard/earnings_overview";

export const getEarningsOverview = async (range: EarningsOverviewRange = "7d"): Promise<EarningsOverview> => {
    const response = await serviceClient.get(`/campaign/influencer/dashboard/earnings-overview`, {
        params: { range },
    });
    return response.data.data;
};
