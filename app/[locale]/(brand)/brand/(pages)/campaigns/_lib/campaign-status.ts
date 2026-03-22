export type CampaignTabKey =
  | "active"
  | "budgeting_quoting"
  | "completed"
  | "draft"
  | "cancelled";

export const STATUS_QUERY: Record<CampaignTabKey, string> = {
  active: "active",
  budgeting_quoting: "quoting",
  completed: "completed",
  draft: "draft",
  cancelled: "cancelled",
};

export const TAB_TITLE: Record<CampaignTabKey, string> = {
  active: "activeJobs",
  budgeting_quoting: "budgetingAndQuoting",
  completed: "completedJobs",
  draft: "draftCampaigns",
  cancelled: "cancelled",
};
