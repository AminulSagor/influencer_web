import type { CampaignTabKey } from "@/types/admin/campaign/campaign_filter_types";

export const TAB_LABEL: Record<CampaignTabKey, string> = {
  all: "All",
  "needs-quote": "Needs Quote",
  active: "Active",
  "pending-invitation": "Pending Invitation",
  completed: "Completed",
  paid: "Paid",
  canceled: "Canceled",
};

export const TAB_TO_BACKEND_STATUSES: Record<CampaignTabKey, string[]> = {
  all: [],

  // ✅ quote/negotiation stage
  "needs-quote": ["received", "negotiating", "agency_negotiating"],

  // ✅ pending stage
  "pending-invitation": ["pending_influencer", "pending_agency", "agency_accepted"],

  active: ["active"],
  completed: ["completed"],

  // ⚠️ backend has no paid → cannot work unless you define your own rule
  paid: [],

  // ✅ backend spelling is "cancelled" (double L)
  canceled: ["cancelled", "declined"],
};
