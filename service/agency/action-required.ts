import { serviceClient } from "@/service/base/axios_client";
import type { ActionRequiredResponse } from "@/types/agency/action-required";

export const getActionRequired =
    async (): Promise<ActionRequiredResponse> => {
        const response = await serviceClient.get<ActionRequiredResponse>(
            "/agency/dashboard/actions"
        );

        return response.data;
    };