export type DashboardChartUserType = "agency" | "influencer";

export type DashboardChartDateRange =
  | "today"
  | "last_3_days"
  | "last_7_days"
  | "last_15_days"
  | "last_30_days"
  | "last_1_year"
  | "lifetime";

export interface DashboardChartStatItem {
  label: string;
  value: number;
  color: string;
}

export interface DashboardChartStatsResponse {
  success: boolean;
  filter: {
    dateRange: DashboardChartDateRange;
    userType: DashboardChartUserType;
  };
  data: DashboardChartStatItem[];
}