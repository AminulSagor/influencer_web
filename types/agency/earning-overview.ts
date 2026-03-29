export type EarningBreakdownItem = {
    date: string;
    amount: number;
    paymentCount: number;
};

export type EarningOverviewData = {
    totalEarnings: number;
    completedJobs: number;
    currency: string;
    timeRange: string;
    breakdown: EarningBreakdownItem[];
};

export type EarningOverviewResponse = {
    success: boolean;
    data: EarningOverviewData;
};

export type EarningRange = "7d" | "15d" | "30d";