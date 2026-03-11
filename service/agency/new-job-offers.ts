import { serviceClient } from "@/service/base/axios_client";
import type { NewJobOffersResponse } from "@/types/agency/new-job-offers";

export type JobTab =
    | "new_offer"
    | "quoted"
    | "active"
    | "completed"
    | "pending"
    | "declined";

export type NewJobOffersParams = {
    page?: number;
    limit?: number;
    tab?: JobTab;
    search?: string;
    sort?: "low_budget" | "high_budget";
};

export const getNewJobOffers = async (
    {
        page = 1,
        limit = 6,
        tab = "new_offer",
        search = "",
        sort = "low_budget",
    }: NewJobOffersParams = {}
): Promise<NewJobOffersResponse> => {
    const response = await serviceClient.get<NewJobOffersResponse>(
        "/campaign/agency/list",
        {
            params: {
                page,
                limit,
                tab,
                search: search.trim() || undefined,
                sort,
            },
        }
    );

    return response.data;
};