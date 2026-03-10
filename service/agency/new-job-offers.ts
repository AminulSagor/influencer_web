import { serviceClient } from "@/service/base/axios_client";
import type { NewJobOffersResponse } from "@/types/agency/new-job-offers";

export const getNewJobOffers =
    async (): Promise<NewJobOffersResponse> => {
        const response = await serviceClient.get<NewJobOffersResponse>(
            "/campaign/agency/list?page=1&limit=10&tab=new_offer"
        );

        return response.data;
    };