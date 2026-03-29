export type UserCampaignTab =
  | "all"
  | "need_quote"
  | "active"
  | "pending_invitation"
  | "completed"
  | "paid"
  | "cancelled";

export type UserCampaignStatus =
  | "needs_quote"
  | "active"
  | "pending_invitation"
  | "completed"
  | "paid"
  | "canceled"
  | "negotiating"
  | "pending_influencer"
  | "pending_agency"
  | "agency_negotiating"
  | "agency_accepted"
  | "cancelled"
  | "declined";

export interface UserCampaign {
  id: string;
  campaignInfo: {
    name: string;
    type: string;
    niche: string;
  };
  promotedBy?: {
    name: string;
    image: string | null;
  };
  client?: {
    name: string;
    image: string | null;
  };
  timeline: {
    start: string;
    end: string;
  };
  financials: {
    clientBudget: number;
    finalQuoteAmount: number;
  };
  status: UserCampaignStatus;
  progress: number;
}

export interface UserCampaignListResponse {
  success: boolean;
  data: UserCampaign[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type UserType = "influencer" | "agency" | "client";
