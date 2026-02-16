import { CampaignStatus } from "@/types/admin/campaign/campaign-ui_type";

export const progressMap: Record<CampaignStatus, number> = {
  draft: 0,
  received: 10,
  negotiating: 20,

  pending_influencer: 30,
  pending_agency: 30,
  agency_negotiating: 25,
  agency_accepted: 35,

  active: 70,
  completed: 100,

  cancelled: 0,
  declined: 0,
};

export const isProgressStatus = (s: CampaignStatus) =>
  [
    "received",
    "negotiating",
    "pending_influencer",
    "pending_agency",
    "agency_negotiating",
    "agency_accepted",
    "active",
    "completed",
  ].includes(s);

  export const baseBtn =
  "bg-Secondary text-light-green border border-light-green hover:bg-Secondary/90 hover:text-light-green";

export const activeBtn =
  "bg-light-green text-white hover:bg-light-green/90 hover:text-white";

