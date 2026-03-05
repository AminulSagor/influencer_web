// types/campaign/place_campaign_type.ts
export interface CampaignBudget {
  baseBudget: string;
  vatAmount: string;
  totalBudget: string;
  netPayableAmount: string;
}

export interface PlacedCampaignData {
  id: string;
  campaignName: string;
  status: string;
  placedAt: string; // ISO date string
  budget: CampaignBudget;
}

export interface PlaceCampaignResponse {
  success: boolean;
  message: string;
  data: PlacedCampaignData;
}
