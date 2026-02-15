// types/campaign/get_campaign_type.ts

export interface Influencer {
  id: string;
  firstName: string;
  lastName: string;
  profileImg: string | null;
}

export interface Milestone {
  id: string;
  contentTitle: string;
  platform: string;
  contentQuantity: string;
  deliveryDays: number;
  expectedReach: number | null;
  expectedViews: number | null;
  expectedLikes: number | null;
  expectedComments: number | null;
  promotionGoal: string;
  amount: string;
  bonusAmount: string;
  bonusStatus: string;
  status: string;
  order: number;
  campaignId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  category: string;
  assetType: string;
  fileName: string;
  fileUrl: string;
  fileSize: string | null;
  mimeType: string | null;
  description: string | null;
  campaignId: string;
  createdAt: string;
}

export interface ClientInfo {
  id: string;
  brandName: string;
  profileImg: string | null;
  socialLinks: string[];
}

export interface CampaignApi {
  id: string;
  campaignName: string;
  campaignType: string;
  productType: string;
  campaignNiche: string;
  preferredInfluencers: Influencer[];
  notPreferableInfluencers: Influencer[];
  assignedAgencies: any[];
  availableBudgetForExecution: string;
  campaignGoals: string;
  productServiceDetails: string;
  reportingRequirements: string;
  usageRights: string;
  startingDate: string;
  duration: number;
  dos: string;
  donts: string;
  baseBudget: string;
  vatAmount: string;
  totalBudget: string;
  paymentStatus: string;
  isRated: boolean;
  rating: string;
  milestones: Milestone[];
  assets: Asset[];
  status: string;
  currentStep: number;
  client: ClientInfo;
  createdAt: string;
}

export interface GetCampaignResponse {
  success: boolean;
  data: CampaignApi;
}
