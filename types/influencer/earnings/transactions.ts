export interface TransactionItem {
    transactionId: string;
    jobId: string;
    date: string;
    jobName: string;
    campaignName: string;
    clientName: string;
    amount: number;
    status: string;
    paymentMethod: string;
}

export interface TransactionsMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TransactionsResponse {
    success: boolean;
    data: TransactionItem[];
    meta: TransactionsMeta;
}
