import { serviceClient } from "@/service/base/axios_client";
import { TransactionsResponse } from "@/types/influencer/earnings/transactions";

export const getTransactions = async (page = 1, limit = 10, search?: string): Promise<TransactionsResponse> => {
    const response = await serviceClient.get(`/influencer/earnings/transactions`, {
        params: {
            page,
            limit,
            ...(search ? { search } : {}),
        },
    });
    return response.data;
};
