export type TransactionSortOrder = "ASC" | "DESC";

export type RecentTransactionItem = {
    campaignId: string;
    date: string;
    campaignName: string;
    amount: number;
    transactionType: string;
};

export type RecentTransactionsMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type RecentTransactionsResponse = {
    success: boolean;
    data: RecentTransactionItem[];
    meta: RecentTransactionsMeta;
};

export type GetRecentTransactionsParams = {
    page: number;
    limit: number;
    search?: string;
    sort: TransactionSortOrder;
};