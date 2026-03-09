import type { CampaignTabKey } from "./campaign-status";

export const CAMPAIGN_TAB_ITEMS: Array<{
  key: CampaignTabKey;
  label: string;
}> = [
  { key: "active", label: "Active" },
  { key: "budgeting_quoting", label: "Budgeting & Quoting" },
  { key: "completed", label: "Completed" },
  { key: "draft", label: "Draft" },
  { key: "cancelled", label: "Cancelled" },
];