export interface LastCompletedJob {
    id: string;
    name: string;
    completedAt: string;
}

export interface TopClient {
    name: string;
    image: string | null;
    jobsCompleted: number;
    lastCompletedJob: LastCompletedJob | null;
}

export interface LifetimeSummary {
    totalEarnings: number;
    totalJobsCompleted: number;
    totalJobsDeclined: number;
    topClient: TopClient | null;
    mostUsedPlatform: string | null;
}
