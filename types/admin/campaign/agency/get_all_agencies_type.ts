export type AgencyApiItem = {
  id: string;
  agencyName: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  logo?: string | null;
  averageRating?: string | null;
  totalReviews?: number | null;
  user?: { email?: string | null } | null;
};

export type GetAllAgenciesResponse = {
  success: boolean;
  data: AgencyApiItem[];
};