import { serviceClient } from "@/service/base/axios_client";
import type {
    GetRecentTransactionsParams,
    RecentTransactionsResponse,
} from "@/types/agency/recent-transactions";

export const getRecentTransactions = async ({
    page,
    limit,
    search,
    sort,
}: GetRecentTransactionsParams): Promise<RecentTransactionsResponse> => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort,
    });

    if (search?.trim()) {
        params.set("search", search.trim());
    }

    const response = await serviceClient.get<RecentTransactionsResponse>(
        `/agency/earnings/transactions?${params.toString()}`
    );

    return response.data;
};