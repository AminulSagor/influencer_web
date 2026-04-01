export type InfluencerPlatform = "Instagram" | "YouTube" | "TikTok" | string;

export type InfluencerListItem = {
  id: string;
  name: string;
  avatar: string | null;
  rating: number;
  totalReviews: number;
  niches: string[] | null;
  platforms: InfluencerPlatform[] | null;
};