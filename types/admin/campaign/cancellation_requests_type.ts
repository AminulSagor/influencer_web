export type CancellationTargetType = "influencer" | "agency" | "brand";

export type CancellationAssignedPersonal = {
  id: string;
  name: string;
  image?: string | null;
};

export type CancellationCampaignInfo = {
  id: string;
  name: string;
  niche: string;
  type: string;
  rawType: string;
};

export type CancellationClientInfo = {
  id: string;
  name: string;
  role: string;
  image?: string | null;
};

export type CancellationTimeline = {
  startDate: string;
  endDate: string;
  duration: number;
};

export type CancellationFinancials = {
  clientBudget: number;
  finalQuoteAmount: number;
};

export type CancellationStatusInfo = {
  status: string;
  progress: number;
};

export type CancellationRequestItem = {
  campaignInfo: CancellationCampaignInfo;
  clientInfo: CancellationClientInfo;
  timeline: CancellationTimeline;
  financials: CancellationFinancials;
  statusInfo: CancellationStatusInfo;
  assignedPersonals: CancellationAssignedPersonal[];
  requestId: string;
  targetType: CancellationTargetType;
  cancellationReason: string;
  requestedAt: string;
};

export type CancellationRequestsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CancellationRequestsResponse = {
  success: boolean;
  data: CancellationRequestItem[];
  meta: CancellationRequestsMeta;
};

export type CancellationRequestDetails = {
  requestId: string;
  targetType: CancellationTargetType;
  cancellationReason: string;
  requestedAt: string;
};

export type CancellationRequestDetailsResponse = {
  success: boolean;
  data: CancellationRequestDetails;
};

export type ProcessCancellationAction = "approve" | "decline";

