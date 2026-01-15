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
  active: "Active Jobs",
  budgeting_quoting: "Budgeting & Quoting",
  completed: "Completed Jobs",
  draft: "Draft Campaigns",
  cancelled: "Cancelled",
};
