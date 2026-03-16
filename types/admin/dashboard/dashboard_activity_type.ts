export type DashboardActivityType =
  | "campaign"
  | "submission"
  | "payment"
  | "user"
  | "verification"
  | "rating";

export interface DashboardActivityItem {
  type: DashboardActivityType;
  title: string;
  description: string;
  date: string;
}

export interface DashboardActivityResponse {
  success: boolean;
  data: DashboardActivityItem[];
}