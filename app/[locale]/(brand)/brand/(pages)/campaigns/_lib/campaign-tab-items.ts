import type { CampaignTabKey } from "./campaign-status";

export const CAMPAIGN_TAB_ITEMS: Array<{
  key: CampaignTabKey;
  labelKey: string;
}> = [
  { key: "active", labelKey: "active" },
  { key: "budgeting_quoting", labelKey: "budgeting_quoting" },
  { key: "completed", labelKey: "completed" },
  { key: "draft", labelKey: "draft" },
  { key: "cancelled", labelKey: "cancelled" },
];