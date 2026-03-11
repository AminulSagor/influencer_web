export type WorkInProgressItem = {
    campaignId: string;
    campaignName: string;
    brandName: string;
    status: string;
    totalBudget: string;
    startedAt: string;
    progress: number;
    duration: number;
    serviceFee: number;
};

export type WorkInProgressResponse = {
    success: boolean;
    data: WorkInProgressItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
};