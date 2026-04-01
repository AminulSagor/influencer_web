import { serviceClient } from "@/service/base/axios_client";
import type {
    GetReportsParams,
    ReportsResponse,
} from "@/types/agency/reports";

export const getReports = async ({
    page,
    limit,
    search,
    status,
}: GetReportsParams): Promise<ReportsResponse> => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (search?.trim()) {
        params.set("search", search.trim());
    }

    if (status) {
        params.set("status", status);
    }

    const response = await serviceClient.get<ReportsResponse>(
        `/agency/reports?${params.toString()}`
    );

    return response.data;
};