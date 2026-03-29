export type TopClientLastCompletedJob = {
    id: string;
    name: string;
    completedAt: string;
};

export type TopClient = {
    name: string;
    image: string;
    jobsCompleted: number;
    lastCompletedJob: TopClientLastCompletedJob | null;
};

export type LifetimeSummaryData = {
    totalEarnings: number;
    totalJobsCompleted: number;
    totalJobsDeclined: number;
    topClient: TopClient | null;
    mostUsedPlatform: string;
};

export type LifetimeSummaryResponse = {
    success: boolean;
    data: LifetimeSummaryData;
};