export type DashboardSummaryData = {
    lifetimeEarnings: number;
    pendingEarnings: number;
    activeJobs: number;
    newOffers: number;
};

export type DashboardSummaryResponse = {
    success: boolean;
    data: DashboardSummaryData;
};