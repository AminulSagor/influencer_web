export type GetCampaignParams = {
  page?: number;
  limit?: number;
  campaignType?: string;
  status?: string;
  search?: string;
  clientId?: string;
  startDateFrom?: string;
  startDateTo?: string;
};

export type AdminCampaignApiItem = {
  id: string;
  campaignName: string;
  campaignType: string;
  startingDate: string | null;
  duration: number | null;
  totalBudget: string | null;
  paymentStatus: string;
  status: string;
  isPlaced: boolean;
  placedAt: string | null;
  client?: {
    id: string;
    brandName: string;
    profileImg?: string | null;
    image?: string | null;
    logo?: string | null;
  } | null;
  assignedInfluencers?: {
    id: string;
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    profileImg?: string;
    ImageUrl?: string;
    imageUrl?: string;
    image?: string;
    city?: string;
    country?: string;
    address?: string;
  }[];
  assignedAgency?: unknown[] | Record<string, unknown> | null;
  assignedAgencies?: unknown[] | null;
  createdAt: string;
};

export type GetCampaignResponse = {
  success: boolean;
  data: AdminCampaignApiItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};