export type EarningSummaryData = {
    lifetimeEarnings: number;
    pendingEarnings: {
        amount: number;
        campaignCount: number;
    };
    recentEarning: {
        amount: number;
        date: string;
    };
};

export type EarningSummaryResponse = {
    success: boolean;
    data: EarningSummaryData;
};