export interface EarningsBreakdownItem {
    date: string;
    amount: number;
    paymentCount: number;
}

export interface EarningsOverview {
    totalEarnings: number;
    completedJobs: number;
    currency: string;
    timeRange: string;
    breakdown: EarningsBreakdownItem[];
}

export type EarningsOverviewRange = "7d" | "30d" | "90d" | "1y";
