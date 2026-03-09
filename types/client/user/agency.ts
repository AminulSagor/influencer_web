export type AgencyUser = {
  email: string;
};

export type AgencyNiche = {
  niche: string;
  status: string;
};

export type AgencySocialLink = {
  platform?: string;
  url?: string;
};

export type AgencyListItem = {
  id: string;
  agencyName: string;
  firstName: string;
  lastName: string;
  logo: string | null;
  niches: AgencyNiche[] | null;
  socialLinks: AgencySocialLink[] | null;
  averageRating: string;
  totalReviews: number;
  user: AgencyUser;
  fullName: string;
};