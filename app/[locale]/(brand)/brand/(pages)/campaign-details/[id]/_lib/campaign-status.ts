import { CampaignStatus } from "@/types/client/campaigns/campaign-details";

export type CampaignType = "paid_ad" | "influencer_promotion";

export const PAID_AD_QUOTATION_STATUSES: CampaignStatus[] = [
  "pending_agency",
  "agency_negotiating",
  "received",
  "negotiating",
];

export function shouldShowAgencyQuotationTabs(
  campaignType: CampaignType,
  status: CampaignStatus,
) {
  if (campaignType !== "paid_ad") {
    return false;
  }

  return PAID_AD_QUOTATION_STATUSES.includes(status);
}

export function getDefaultCampaignTab(
  campaignType: CampaignType,
  status: CampaignStatus,
) {
  if (shouldShowAgencyQuotationTabs(campaignType, status)) {
    return "agency-quotations";
  }

  return "details";
}
