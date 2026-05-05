export type RateableEntityType = "influencer" | "agency" | "client";

export type RateableEntity = {
  id: string;
  name: string;
  image: string | null;
  type: RateableEntityType;
};