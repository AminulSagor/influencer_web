export type DashboardActionTab =
  | "all"
  | "new_campaigns"
  | "verifications"
  | "milestone_reviews"
  | "payout_requests"
  | "cancellations";

export type DashboardActionType =
  | "verification"
  | "payout"
  | "milestone_review"
  | "campaign_approval"
  | "cancellation";

export interface DashboardActionsBadges {
  newCampaignRequests: number;
  pendingVerification: number;
  milestoneReviews: number;
  payoutRequests: number;
  cancellations: number;
}

export interface DashboardActionMeta {
  tab: DashboardActionTab;
  page: number;
  limit: number;
  currentCount: number;
}

export interface DashboardActionItem {
  id: string;
  type: DashboardActionType;
  priority: "High" | "Medium" | "Low";
  title: string;
  description: string;
  date: string;
  actionLink: string;
}

export interface DashboardActionsResponse {
  success: boolean;
  badges: DashboardActionsBadges;
  meta: DashboardActionMeta;
  data: DashboardActionItem[];
}