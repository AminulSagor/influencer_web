export interface StepTwoPayload {
  productType: string;
  campaignNiche: string;
  preferredInfluencers: string[];
  notPreferableInfluencers: string[];
}

export type StepTwoPayloadForAgency = {
  campaignNiche: string;
  agencyId: string[];
};

//================agency=======================//
export type FieldErrors = Partial<
  Record<"campaignNiche" | "selectedAgencies", string>
>;

export type Agency = {
  id: string;
  name: string;
  subtitle: string;
};

export type AgencyApiItem = {
  id: string;
  agencyName: string;
  fullName: string;
};

export type AgencyListResponse = {
  data?: AgencyApiItem[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
};
