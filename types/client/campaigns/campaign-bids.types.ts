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
  id?: string;
  agencyId?: string;
  agencyName?: string;
  agencyLogo?: string | null;
  logo?: string | null;

  agencyFeePercent?: string | number | null;
  appliedFeePercent?: string | number | null;
  proposedServiceFeePercent?: string | number | null;

  agencyFeeAmount?: string | number | null;
  agencyServiceFeeAmount?: string | number | null;

  budgetExcludingAgencyFee?: string | number | null;
  totalpayableExcludingAgencyServiceFee?: string | number | null;

  inDollar?: string | number | null;
  totalCampaignSpentInDollar?: string | number | null;

  dollarRate?: string | number | null;

  nicheLabels?: string[];
  niche?: { niche?: string; status?: string; rejectReason?: string }[];

  createdAt?: string;
  submittedAt?: string;

  agency?: {
    id?: string;
    agencyName?: string;
    logo?: string | null;
    niches?: { name?: string }[];
  };
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
