export type SubmissionStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "declined"
  | "completed";

export type SubmissionSummary = {
  id: string;
  campaignId: string;
  campaignName: string;
  influencerName: string | null;
  influencerImage: string | null;
  milestoneTitle: string;
  amount: number;
  attachments: string[];
  liveLinks: string[];
  status: SubmissionStatus;
  isApproved: boolean;
  submittedAt: string;
};

export type SubmissionDetail = {
  id: string;
  submissionDescription: string | null;
  submissionAttachments: string[];
  submissionLiveLinks: string[];
  requestedAmount: string;
  submittedByRole: string;
  rejectionReason: string | null;
  isClientApproved: boolean;
  achievedReach: number | null;
  achievedViews: number | null;
  achievedLikes: number | null;
  achievedComments: number | null;
  paidAmount: string;
  paymentStatus: string;
  adminFeedback: string | null;
  status: SubmissionStatus;
  assignmentId: string;
  milestoneId: string;
  assignedMilestoneId: string;
  createdAt: string;
  updatedAt: string;
  milestoneTitle: string;
};

export type ClientSubmissionDetailResponse = {
  id: string;
  campaignId: string;
  campaignName: string;
  influencer: {
    id: string;
    name: string;
    image: string | null;
  } | null;
  milestone: {
    id: string;
    title: string;
    amount: number;
  } | null;
  content: {
    description: string | null;
    attachments: string[];
    liveLinks: string[];
  };
  status: SubmissionStatus;
  isApproved: boolean;
  paymentStatus: string;
  createdAt: string;
};

export type InfluencerPromotionSubmissionListItem = {
  summary: SubmissionSummary;
  detail: SubmissionDetail;
};

export type CampaignAssignedWorkSubmission = {
  id: string;
  submissionDescription: string | null;
  submissionAttachments: string[];
  submissionLiveLinks: string[];
  requestedAmount: string;
  submittedByRole: string;
  rejectionReason: string | null;
  isClientApproved: boolean;
  achievedReach: number | null;
  achievedViews: number | null;
  achievedLikes: number | null;
  achievedComments: number | null;
  paidAmount: string;
  paymentStatus: string;
  adminFeedback: string | null;
  status: SubmissionStatus;
  assignmentId: string;
  milestoneId: string;
  assignedMilestoneId: string;
  createdAt: string;
  updatedAt: string;
};

export type CampaignAssignedWork = {
  id: string;
  masterMilestoneId: string;
  contentTitle: string;
  platform: string | null;
  contentQuantity: string | null;
  deliveryDays: number | null;
  amount: number;
  status: string;
  submissions: CampaignAssignedWorkSubmission[];
};

export type CampaignAssignedInfluencer = {
  assignmentId: string;
  influencerId: string;
  name: string;
  image: string | null;
  location: string | null;
  country: string | null;
  status: string;
  offeredAmount: number;
  assignedWork: CampaignAssignedWork[];
};

export type SubmissionMetricRow = {
  key: string;
  label: string;
  achieved: number;
  target: number;
  percent: number;
};

export type ClientCampaignDetailsResponse = {
  assignedInfluencers?: CampaignAssignedInfluencer[];
};