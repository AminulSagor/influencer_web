export type RateableEntityType = "influencer" | "agency" | "client";

export type RateableEntity = {
  id: string;
  name: string;
  image: string | null;
  type: RateableEntityType;
};

export type AgencyRatingFallback = {
  name?: string | null;
  image?: string | null;
};
