import { serviceClient } from "@/service/base/axios_client";
import type { AgencyCampaignDetailsResponse } from "@/types/agency/job-details";

export const getAgencyCampaignDetails = async (
    campaignId: string,
    token?: string
): Promise<AgencyCampaignDetailsResponse> => {
    const response = await serviceClient.get<AgencyCampaignDetailsResponse>(
        `/campaign/agency/${campaignId}`,
        token
            ? {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            : undefined
    );

    return response.data;
};