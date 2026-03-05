export type InfluencerListItem = {
  userId: string;
  name: string;
  avatar: string | null;

  niches: string[];
  skills: string[];

  rating: number;
  platforms: string[];

  stats: {
    activeJob: number;
    jobDone: number;
    revenue: number;
  };

  status: string;
  isVerified: boolean;
};