export type ExploreType = "influencer" | "ad-agencies";

export type ExploreSearchParams = {
  type?: string;
  page?: string;
  limit?: string;
};

export type ExplorePagination = {
  page: number;
  limit: number;
};

export type Influencer = {
  id: string;
  name: string;
  avatar: string | null;
  rating: number;
  totalReviews: number;
  niches: string[] | null;
  platforms: string[] | null;
};

export type AgencyNiche = {
  niche: string;
  status: string;
};

export type Agency = {
  id: string;
  agencyName: string;
  firstName: string;
  lastName: string;
  logo: string | null;
  niches: AgencyNiche[] | null;
  socialLinks: unknown[] | null;
  averageRating: string;
  totalReviews: number;
  user: {
    email: string;
  };
  fullName: string;
};