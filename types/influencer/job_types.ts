// Types derived from the Postman API collection responses

export type JobStatus = "new_offer" | "pending_payment" | "active" | "completed" | "declined";
export type JobSortOption = "high_budget" | "low_budget";

// GET /campaign/influencer/jobs response
export interface JobListItem {
  id: string;
  campaignId: string;
  campaignName: string;
  brandName: string;
  offeredAmount: number | string;
  totalAmount: number | string;
  status: JobStatus;
  startingDate: string;
  duration: number;
  progress: number;
  rating: string;
  message: string | null;
  address: JobAddress | null;
  createdAt: string;
}

export interface JobAddress {
  addressName: string;
  street: string;
  thana: string;
  zilla: string;
  fullAddress: string;
}

export interface JobPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobListResponse {
  success: boolean;
  data: JobListItem[];
  pagination: JobPagination;
}

export interface JobListParams {
  status?: JobStatus;
  campaignId?: string;
  sort?: JobSortOption;
  page?: number;
  limit?: number;
  search?: string;
}

// GET /campaign/influencer/jobs/counts
export interface JobCountsResponse {
  success: boolean;
  data: Record<string, number>;
}

// GET /campaign/influencer/job/:jobId (Job Details)
export interface CampaignAsset {
  id: string;
  category: string;
  assetType: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  mimeType: string;
  description: string;
  campaignId: string;
  createdAt: string;
}

export interface CampaignClient {
  id: string;
  brandName: string;
  profileImg: string | null;
}

export interface JobCampaign {
  id: string;
  campaignName: string;
  campaignType: string;
  productType: string;
  campaignNiche: string;
  campaignGoals: string;
  productServiceDetails: string;
  reportingRequirements: string;
  usageRights: string;
  startingDate: string;
  duration: number;
  dos: string;
  donts: string;
  needSampleProduct: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  assets: CampaignAsset[];
  client: CampaignClient;
}

export interface JobDetailMilestone {
  id: string;
  title: string;
  platform?: string;
  contentQuantity: string;
  amount: number;
  deliveryDays: number;
  order: number;
  expectedLikes: number;
  expectedComments: number;
  status: string;
}

export interface JobDetail {
  id: string;
  campaignId: string;
  influencerId: string;
  assignedBy: string;
  offeredAmount: number | string;
  totalAmount: number | string;
  declineReason: string | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  campaign: JobCampaign;
  milestones: JobDetailMilestone[];
  deliveryAddress: JobAddress | null;
}

export interface JobDetailResponse {
  success: boolean;
  data: JobDetail;
}

// POST /campaign/influencer/job/:jobId/accept
export interface AcceptJobPayload {
  addressId?: string;
}

export interface AcceptJobResponse {
  success: boolean;
  message: string;
  data: {
    assignmentId: string;
    address: JobAddress;
  };
}

// POST /campaign/influencer/job/:jobId/decline
export interface DeclineJobPayload {
  reason?: string;
}

export interface DeclineJobResponse {
  success: boolean;
  message: string;
}

// POST /campaign/influencer/job/:jobId/complete
export interface CompleteJobPayload {
  completionNotes?: string;
}

export interface CompleteJobResponse {
  success: boolean;
  message: string;
}

// POST /campaign/influencer/job/:assignmentId/report-product
export interface ReportProductResponse {
  success: boolean;
  message: string;
}

// GET /campaign/influencer/addresses
export interface InfluencerAddress {
  id: string;
  addressName: string;
  street: string;
  thana: string;
  zilla: string;
  fullAddress: string;
  isDefault?: boolean;
}

export interface AddressListResponse {
  success: boolean;
  data: InfluencerAddress[];
}
