export type RateableEntityType = "influencer" | "client";

export type RateableEntity = {
  id: string;
  name: string;
  image: string | null;
  type: RateableEntityType;
};