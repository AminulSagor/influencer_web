export type CampaignStatusKey =
  | "draft"
  | "received"
  | "negotiating"
  | "quoted"
  | "paid"
  | "partial_paid"
  | "promoting"
  | "accepted"
  | "approved"
  | "active"
  | "in_review"
  | "pending_agency"
  | "agency_accepted"
  | "agency_negotiating"
  | "completed"
  | "cancelled"
  | "declined"
  | "pending_influencer"
  | string;

export type CampaignType = "paid_ad" | "influencer_promotion" | string;

export const PAID_AD_QUOTATION_STATUSES: CampaignStatusKey[] = [
  "pending_agency",
  "agency_negotiating",
  "received",
  "negotiating",
];

export function shouldShowAgencyQuotationTabs(
  campaignType: CampaignType,
  status: CampaignStatusKey,
) {
  if (campaignType !== "paid_ad") {
    return false;
  }

  return PAID_AD_QUOTATION_STATUSES.includes(status);
}

export function getDefaultCampaignTab(
  campaignType: CampaignType,
  status: CampaignStatusKey,
) {
  if (shouldShowAgencyQuotationTabs(campaignType, status)) {
    return "agency-quotations";
  }

  return "details";
}