export interface WorkInProgressItem {
    jobId: string;
    campaignId: string;
    campaignName: string;
    brandName: string;
    status: string;
    totalAmount: number;
    startedAt: string;
    progress: number;
    duration: number;
}

export interface WorkInProgressMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface WorkInProgressResponse {
    success: boolean;
    data: WorkInProgressItem[];
    meta: WorkInProgressMeta;
}
