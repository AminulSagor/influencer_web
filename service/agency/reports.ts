import { serviceClient } from "@/service/base/axios_client";
import type {
    GetReportsParams,
    ReportStatus,
    ReportsResponse,
} from "@/types/agency/reports";

const toApiStatus = (status?: ReportStatus) => {
    if (!status) return undefined;
    return status.charAt(0).toUpperCase() + status.slice(1);
};

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

    const apiStatus = toApiStatus(status);

    if (apiStatus) {
        params.set("status", apiStatus);
    }

    const response = await serviceClient.get<ReportsResponse>(
        `/agency/reports?${params.toString()}`
    );

    return response.data;
};