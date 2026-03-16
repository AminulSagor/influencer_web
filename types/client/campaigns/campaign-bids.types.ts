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
  email?: string;
  phone?: string;
};

export type RawCampaignBid = {
  agencyId: string;
  agencyName: string;
  email: string;
  phone: string;
  logo: string | null;
  niche: Array<{
    niche: string;
    status: string;
    rejectReason?: string;
  }>;
  appliedFeePercent: number | string;
  proposedServiceFeePercent?: string;
  totalpayableExcludingAgencyServiceFee: number | string;
  agencyServiceFeeAmount: number | string;
  dollarRate: number | string;
  totalCampaignSpentInDollar: number | string;
  hasRequoted?: boolean;
  submittedAt?: string;
};

export type CampaignBidsResponse = {
  success: boolean;
  campaignName: string;
  data: RawCampaignBid[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type SelectAgencyPayload = {
  campaignId: string;
  agencyId: string;
};
