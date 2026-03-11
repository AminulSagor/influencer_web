import { serviceClient } from "@/service/base/axios_client";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";

export const getAgencyProfile =
    async (): Promise<AgencyProfileResponse> => {
        const response = await serviceClient.get<AgencyProfileResponse>(
            "/agency/profile"
        );

        return response.data;
    };