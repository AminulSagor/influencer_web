export type UpcomingDeadlineItem = {
    campaignId: string;
    campaignName: string;
    deadline: string;
    milestonesLeftText: string;
};

export type UpcomingDeadlinesResponse = {
    success: boolean;
    data: UpcomingDeadlineItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
};