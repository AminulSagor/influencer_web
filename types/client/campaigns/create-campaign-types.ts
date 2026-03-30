//create campaign z-store types
export type CampaignType = "paid_ad" | "influencer_promotion";
export interface campaignStoreType {
  step: number;
  setStep: (step: number) => void;
  increaseStep: () => void;
  decreaseStep: () => void;

  open: boolean;
  toggleOpen: () => void;

  campaignType: CampaignType;
  campaignId: string;

  setCampaignId: (id: string) => void;
  setCampaignType: (t: CampaignType) => void;
  resetCampaignStore: () => void;
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

export type serviceMilestoneInfluencer = {
  contentTitle: string;
  platform: string;
  contentQuantity: string;
  deliveryDays: number;
  expectedReach: number;
  expectedViews: number;
  expectedLikes: number;
  expectedComments: number;
};

export type serviceMilestonePaidAd = {
  contentTitle: string;
  platform: string;
  contentQuantity: string;
  deliveryDays: number;
  promotionGoal: string;
  order: number;
} & Partial<{
  expectedReach: number;
  expectedViews: number;
  expectedLikes: number;
  expectedComments: number;
}>;

export type serviceMilestone =
  | serviceMilestoneInfluencer
  | serviceMilestonePaidAd;

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

export interface CampaignMilestoneservice {
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

export interface CampaignAssetservice {
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

//assign infos
interface AssignedMember {
  id: number;
  name: string;
  image: string;
  type: string;
}

export interface CampaignSummary {
  id: string;
  campaignName: string;
  campaignType: CampaignType;
  status: string;
  totalBudget: number;
  assignedTo: AssignedMember[];
  platforms: string[];
  deadline: string;
  progress: number;
  budgetPendingAmount: number;
  negotiationRevisedTimes: number;
  totalQuotationsReceived: number;
}

// ===== CAMPAIGN =====
export interface Campaignservice {
  id: string;
  campaignName: string;
  campaignType: CampaignType;

  productType: string | null;
  campaignNiche: string | null;

  preferredInfluencers: InfluencerLite[];
  notPreferableInfluencers: InfluencerLite[];

  assignedAgencies: AssignedAgency[];
  campaignGoals: string | null;
  productServiceDetails: string | null;

  startingDate: string | null;
  duration: number | null;

  dos: string | null;
  donts: string | null;

  baseBudget: string | null;
  vatAmount: string | null;
  totalBudget: string | null;

  budget?: {
    baseBudget?: string | null;
    vatAmount?: string | null;
    totalBudget?: string | null;
  } | null;

  paymentStatus: PaymentStatus;

  milestones: CampaignMilestoneservice[];
  assets: CampaignAssetservice[];

  status: CampaignStatus | string;
  currentStep: number;

  client: CampaignClient;

  createdAt: string;
  reportingRequirements?: string | null;
  usageRights?: string | null;
  termsConditions?: string | null;
}

export interface serviceSuccessResponse<T> {
  success: true;
  data: T;
}

export interface serviceErrorResponse {
  success: false;
  message?: string;
  data?: unknown;
}
