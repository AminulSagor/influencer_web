export type CampaignStatus =
  | "draft"
  | "received"
  | "negotiating"
  | "pending_influencer"
  | "pending_agency"
  | "agency_negotiating"
  | "agency_accepted"
  | "active"
  | "completed"
  | "cancelled"
  | "declined";

export type CampaignView = "list" | "grid";

export type CampaignAssigneeUI = {
  id: string;
  name: string;
  avatar?: string;
  location?: string;
};

export type CampaignUI = {
  id: string;
  name: string;
  category: string;
  niches: string;
  client: string;
  avatar: string;

  startDate: string;
  endDate: string;

  budget: number;
  quote: number;

  // ✅ backend status only
  status: CampaignStatus;

  assignedPersonals: {
    count: number;
    influencers: CampaignAssigneeUI[];
  };
  paymentStatus?: string;
};
