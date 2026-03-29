export interface UpcomingDeadlineItem {
    campaignId: string;
    jobId: string;
    campaignName: string;
    deadline: string;
    milestonesLeftText: string;
}

export interface UpcomingDeadlinesMeta {
    total: number;
    page: number;
    limit: number;
}

export interface UpcomingDeadlinesResponse {
    success: boolean;
    data: UpcomingDeadlineItem[];
    meta: UpcomingDeadlinesMeta;
}
