export type CampaignBidAgency = {
  id: string;
  agencyName: string;
  logo: string | null;
};

export type CampaignBid = {
  id: string;
  agencyId: string;
  agency: CampaignBidAgency;
  nicheLabels: string[];
  agencyFeePercent: number;
  agencyFeeAmount: number;
  budgetExcludingAgencyFee: number;
  dollarRate: number;
  inDollar: number;
  createdAt?: string;
};

export type RawCampaignBid = {
  id?: string;
  agencyId?: string;
  agency?: {
    id?: string;
    agencyName?: string;
    logo?: string | null;
    niches?: Array<{ name?: string | null }>;
  } | null;
  agencyName?: string;
  agencyLogo?: string | null;
  nicheLabels?: string[];
  agencyFeePercent?: number | string | null;
  agencyFeeAmount?: number | string | null;
  budgetExcludingAgencyFee?: number | string | null;
  dollarRate?: number | string | null;
  inDollar?: number | string | null;
  createdAt?: string;
};

export type CampaignBidsResponse = RawCampaignBid[];

export type SelectAgencyPayload = {
  campaignId: string;
  agencyId: string;
};