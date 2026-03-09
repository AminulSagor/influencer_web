export type FinanceAnalyticsData = {
  grossRevenue: number;
  revenueGrowthRate: number;
  netProfit: number;
  totalPendingBudget: number;
  totalPendingPayout: {
    total: number;
    agency: {
      amount: number;
      percentage: number;
    };
    influencer: {
      amount: number;
      percentage: number;
    };
  };
};

export type FinanceAnalyticsResponse = {
  success: boolean;
  data: FinanceAnalyticsData;
};