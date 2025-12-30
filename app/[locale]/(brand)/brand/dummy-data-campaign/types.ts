// -------------------- Common --------------------
export type ID = string;

export type Platform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "facebook"
  | "linkedin";

export type CampaignTabStatus =
  | "Active"
  | "BudgetingAndQuoting"
  | "Completed"
  | "Draft"
  | "Pending"
  | "Cancelled";

export type CampaignStage =
  | "Submitted"
  | "Quoted"
  | "Paid"
  | "Promoting"
  | "Cancelled"
  | "Completed";

export type Currency = "BDT" | "USD" | "EUR";

export type Money = {
  currency: Currency;
  amount: number;
};

export type Brand = {
  id: ID;
  name: string;
  logoUrl?: string;
};

export type Influencer = {
  id: ID;
  name: string;
  avatarUrl?: string;
  handle?: string;
};

// -------------------- List Page Models --------------------
// Use this for the first 5 screens (cards). Lightweight.
export type CampaignListCard = {
  id: ID;
  title: string;

  brand: Brand;

  tabStatus: CampaignTabStatus; // which list it appears under
  stage: CampaignStage; // stepper state (if needed)

  platforms: Platform[];

  influencersPreview: {
    primaryName?: string; // "Hania Amir"
    extraCount?: number; // +2
    influencerIds: ID[]; // for quick navigation
  };

  // card main value differs by tab (offered, budget pending, quote count, etc.)
  cardValue: {
    type:
      | "OfferedAmount"
      | "BudgetPendingAmount"
      | "QuotationReceivedCount"
      | "None";
    amount?: Money; // for Offered / Budget Pending
    count?: number; // for Quotation Received
  };

  deadline?: {
    date: string; // ISO
    label?: string; // "Due: 3 Days" / "Due: Tomorrow"
  };

  progress?: {
    percent: number; // 0..100 (Active tab shows progress bar)
    label?: string; // "75% Complete"
  };

  completedOn?: string; // ISO (Completed tab)
  rating?: {
    averageStars: number; // 0..5
    totalRatings?: number;
  };

  actions: {
    primary: "ViewCampaignDetails" | "ContinueEditingCampaignDetails" | "None";
  };
};

export type CampaignListResponse = {
  tab: CampaignTabStatus;
  searchQuery?: string;
  sortBy?: "LowToHigh" | "HighToLow" | "Newest" | "Oldest";

  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };

  items: CampaignListCard[];
};

// -------------------- Details Page Models --------------------
export type AssetFile = {
  id: ID;
  title: string;
  fileType: "PDF" | "PNG" | "SVG" | "MP4" | "ZIP" | "DOCX" | "OTHER";
  sizeLabel?: string;
  downloadUrl: string;
};

export type QuoteDetails = {
  baseBudget: Money;
  vatPercent: number;
  vatAmount: Money;
  totalCost: Money;

  paidAmount: Money;
  dueAmount: Money;

  statusLabel?: "PAID" | "DUE" | "PARTIAL" | "N/A" | "CANCELLED" | "PENDING";
};

export type CampaignProgressStepper = {
  currentStage: CampaignStage;
  stages: Array<{
    stage: CampaignStage;
    isDone: boolean;
    doneLabel?: string;
  }>;
};

export type CampaignBrief = {
  campaignGoals: string;
  productOrServiceDetails: string;
  contentRequirements: string[];
  dos?: string[];
  donts?: string[];
};

export type CampaignTerms = {
  reportingRequirements: string[];
  usageRights?: string[];
  notes?: string[];
};

// -------------------- Milestones --------------------
export type MilestoneStatus = "Pending" | "InReview" | "Completed" | "Declined";

export type ProofType = "image" | "video" | "link";

export type MetricKey =
  | "reach"
  | "views"
  | "likes"
  | "comments"
  | "shares"
  | "saves"
  | "reactions";

export type CountMetric = {
  key: MetricKey;
  label: string;
  current: number;
  target: number;
};

export type Proof = {
  id: ID;
  type: ProofType;
  url: string;

  previewUrl?: string; // thumbnail if image/video
  label?: string; // "Proof 1"
};

export type MilestoneSubmission = {
  id: ID;
  description?: string;

  platformLinks: Array<{
    platform: Platform;
    url: string;
  }>;

  proofs: Proof[];

  submittedAt: string; // ISO
  updatedAt?: string; // ISO
};

export type MilestoneReview = {
  status: Exclude<MilestoneStatus, "Pending">; // InReview | Completed | Declined
  message?: string;
  reviewedBy?: string;
  reviewedAt?: string; // ISO
};

export type MilestonePerformance = {
  metrics: CountMetric[];
  averagePerformancePercent: number; // 0..100
  targetHitThresholdPercent?: number; // e.g. 75
};

export type Milestone = {
  id: ID;
  title: string; // "TikTok Campaign"
  dayLabel?: string; // "DAY 3"
  dueDate?: string; // ISO
  status: MilestoneStatus;

  contentRequirements: string[]; // what to deliver

  milestoneTargets?: CountMetric[]; // top target chips/cards

  actions?: {
    canReportAdmin: boolean;
    canViewSubmittedReport: boolean;
  };

  // expanded panel (opens below carousel)
  submission?: MilestoneSubmission;
  performance?: MilestonePerformance;
  review?: MilestoneReview;
};

export type InfluencerCampaignSlice = {
  influencer: Influencer;

  progress: {
    completedCount: number;
    totalCount: number;
    percentCompleted: number; // 0..100
  };

  milestones: Milestone[];
};

// -------------------- Single Campaign Details Payload --------------------
export type CampaignDetails = {
  id: ID;
  title: string;
  brand: Brand;

  tabStatus: CampaignTabStatus; // Active / Completed / etc (for UI mode)
  stage: CampaignStage; // stepper state

  platforms: Platform[];

  deadline?: {
    date: string; // ISO
    daysRemainingLabel?: string; // "4 Days Remaining"
  };

  quote: QuoteDetails;

  rating?: {
    canRate: boolean;
    averageStars?: number;
  };

  progressStepper: CampaignProgressStepper;

  contentAssets: AssetFile[];

  brief: CampaignBrief;
  terms: CampaignTerms;

  influencerCampaigns: InfluencerCampaignSlice[];

  // UI state helpers
  selectedInfluencerId: ID;
  expandedMilestoneId?: ID; // which milestone panel is open
};
