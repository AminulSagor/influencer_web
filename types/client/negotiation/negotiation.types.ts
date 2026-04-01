export type NegotiationSender = "client" | "admin";

export type NegotiationItem = {
  id: string;
  sender: NegotiationSender;
  action: string;
  message: string | null;
  proposedBaseBudget: string | null;
  proposedTotalBudget: string | null;
  isRead: boolean;
  createdAt: string;
};

export type CampaignNegotiationMeta = {
  id: string;
  campaignName: string;
  status: string;
  negotiationTurn: string;
  yourTurn: boolean;
};

export type CampaignNegotiationsData = {
  campaign: CampaignNegotiationMeta;
  negotiations: NegotiationItem[];
};