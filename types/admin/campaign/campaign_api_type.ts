export type CampaignType = "paid_ad" | "influencer_promotion" | string;
export type CampaignBackendStatus = "draft" | "received" | string;

export interface Campaignservice {
  id: string;
  campaignName: string;
  campaignType: CampaignType;
  campaignNiche: string | null;

  client: {
    id: string;
    brandName: string;
    fullName: string;
    avatar?: string | null; // optional
  };

  timeline?: {
    startingDate?: string | null;
    endDate?: string | null;
    duration?: number | null;
  };

  financials?: {
    clientBudget?: number | null;
    finalQuoteAmount?: number | null;
  };

  assignedPersonals?: {
    count?: number;
    influencers?: any[];
  };

  status: CampaignBackendStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CampaignResponse {
  data: Campaignservice[];   // ✅ must be array
  meta: CampaignMeta;
}
