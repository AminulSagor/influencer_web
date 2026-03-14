export type DashboardProfitOverviewDateRange = "lifetime";

export interface DashboardProfitOverviewItem {
  date: string;
  profit: number;
}

export interface DashboardProfitOverviewResponse {
  success: boolean;
  filter: {
    dateRange: DashboardProfitOverviewDateRange;
  };
  data: DashboardProfitOverviewItem[];
}