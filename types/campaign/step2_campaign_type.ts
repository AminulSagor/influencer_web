export interface StepTwoPayload {
  productType: string;
  campaignNiche: string;
  preferredInfluencerIds: string[];
  notPreferableInfluencerIds: string[];
}

export interface StepTwoPayloadforAgency {
  campaignNiche: string;
  agencyId: string[];
}
