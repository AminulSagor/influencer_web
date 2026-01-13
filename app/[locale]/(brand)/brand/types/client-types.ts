//create campaign z-store types
export type CampaignType = "paid_ad" | "influencer_promotion";
export interface campaignStoreType {
  step: number;
  increaseStep: () => void;
  decreaseStep: () => void;
  open: boolean;
  toggleOpen: () => void;

  campaignType: CampaignType;
  campaignId: string;
  setCampaignId: (id: string) => void;
  setCampaignType: (t: "paid_ad" | "influencer_promotion") => void;
}

//create campaign step 4 types
export interface NewMilestoneForm {
  title: string;
  subtitle: string;
  day: string;
  platform: string;
  promotionTarget: {
    title: string;
    amount: string;
  };
  promotionGoal: string;
}

export type ApiMilestone = {
  contentTitle: string;
  platform: string;
  contentQuantity: string;
  deliveryDays: number;
  expectedReach: number;
  expectedViews: number;
  expectedLikes: number;
  expectedComments: number;
};

//respone uplaoad file
export type SignedUrlResponse = {
  signedUrl: string;
  publicUrl: string;
  fileKey: string;
};

export type LocalAsset = {
  id: string;
  file: File;
  category: AssetCategory;
  description: string;
};

// Backend campaign status

export type CampaignStatus =
  | "draft"
  | "received"
  | "negotiating"
  | "quoted"
  | "paid"
  | "partial_paid"
  | "promoting"
  | "accepted"
  | "approved"
  | "active"
  | "in_review"
  | "pending_agency"
  | "agency_accepted"
  | "agency_negotiating"
  | "completed"
  | "cancelled"
  | "declined";

export type PaymentStatus = "pending" | "paid" | "failed" | string;

export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "facebook"
  | "twitter"
  | "linkedin"
  | string;

// ===== COMMON =====
export interface CampaignClient {
  id: string;
  brandName: string;
  profileImg: string | null;
  platform: SocialPlatform[];
}

export interface InfluencerLite {
  id: string;
  firstName: string;
  lastName: string;
  profileImg: string | null;
}

export interface AgencyLite {
  id: string;
  agencyName: string;
  logo: string | null;
}

export interface AssignedAgency {
  id: string;
  agency: AgencyLite;
  isDeclined: boolean;
}

// ===== MILESTONE =====
export type MilestoneStatus = "pending" | "accepted" | "completed" | string;
export type BonusStatus = "unpaid" | "paid" | string;

export interface CampaignMilestoneApi {
  id: string;
  contentTitle: string;
  platform: SocialPlatform;
  contentQuantity: string; // e.g. "1 Video", "1 Reel + 2 Stories"
  deliveryDays: number;

  expectedReach: number | null;
  expectedViews: number | null;
  expectedLikes: number | null;
  expectedComments: number | null;

  promotionGoal: string | null;

  amount: string; // "0.00"
  bonusAmount: string; // "0.00"
  bonusStatus: BonusStatus;

  status: MilestoneStatus;
  order: number;

  campaignId: string;

  createdAt: string;
  updatedAt: string;
}

// ===== ASSET =====
export type AssetCategory = "brand" | "content" | string;

export interface CampaignAssetApi {
  id: string;
  category: AssetCategory;

  assetType: string; // sometimes "Page Link", sometimes "application/pdf", sometimes "brand_guidelines"

  fileName: string; // "guidelines.pdf"
  fileUrl: string; // url / link
  fileSize: string | null; // "5242880" or null
  mimeType: string | null; // "application/pdf" etc (sometimes null)

  description: string | null;

  campaignId: string;
  createdAt: string;
}

// ===== CAMPAIGN =====
export interface CampaignApi {
  id: string;
  campaignName: string;
  campaignType: CampaignType;

  productType: string | null;
  campaignNiche: string | null;

  preferredInfluencers: InfluencerLite[]; // in paid_ad: []
  notPreferableInfluencers: InfluencerLite[];

  assignedAgencies: AssignedAgency[]; // in influencer_promotion: []
  campaignGoals: string | null;
  productServiceDetails: string | null;

  startingDate: string | null; // "2026-02-01"
  duration: number | null; // 30

  dos: string | null;
  donts: string | null;

  baseBudget: string | null; // "100000.00"
  vatAmount: string | null;
  totalBudget: string | null;

  paymentStatus: PaymentStatus;

  milestones: CampaignMilestoneApi[];
  assets: CampaignAssetApi[];

  status: CampaignStatus | string;
  currentStep: number;

  client: CampaignClient;

  createdAt: string;
  reportingRequirements?: string | null;
  usageRights?: string | null;
  termsConditions?: string | null;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message?: string;
  data?: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
