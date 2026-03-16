export type ListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AdminUserCounts = {
  influencer: number;
  agency: number;
  brand: number;
};

export type InfluencerListItem = {
  id: string;
  name: string;
  image: string | null;
  niche: string[];
  rating: number;
  platforms: string[];
  activeJobs: number;
  jobDone: number;
  revenue: number;
  status: string;
  isVerified: boolean;
  skills: string[];
};

export type AgencyListItem = {
  id: string; // profileId
  userId: string;
  name: string;
  image: string | null;
  niche: string[];
  rating: number;
  platforms: string[];
  activeJobs: number;
  jobDone: number;
  revenue: number;
  status: string;
  isVerified: boolean;
};

export type BrandListItem = {
  id: string; // profileId
  userId: string;
  name: string;
  image: string | null;
  niche: string[];
  platforms: string[];
  activeJobs: number;
  jobPlaced: number;
  totalSpent: number;
  status: string;
  isVerified: boolean;
};

export type BrandProfileSocialLink = {
  url: string;
  platform: string;
  status?: string;
};

export type BrandProfileDetails = {
  id: string;
  brandName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profileImg: string | null;
  email: string;
  phone: string;
  thana: string;
  zilla: string;
  fullAddress: string;
  country: string;
  website: string;
  socialLinks: BrandProfileSocialLink[];
  nidNumber: string;
  nidFrontImg: string;
  nidBackImg: string;
  tradeLicenseNumber: string;
  tradeLicenseImg: string;
  tinNumber: string;
  tinImage: string;
  binNumber: string;
  isOnboardingComplete: boolean;
  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isBlocked: boolean;
};