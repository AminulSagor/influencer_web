export type Statistics = { label: string; value: number };

export type CampaignInfluencer = {
  id: string;
  firstName: string;
  lastName: string;
  profileImg: string | null;
};

export type AllInfluencerApiItem = {
  id: string;
  profileId?: string;
  firstName?: string;
  lastName?: string;
  profileImg?: string | null;
  name?: string;
};

export type InfluencerBadgeItem = {
  name: string;
  platform: string;
  profileUrl: string;
};

export type Influencer = {
  id: string; // influencerId
  name: string;
  platform: string;
  profileUrl: string;
  amount: number; // offerAmount
  percentage: number;
};

export type AssignmentRow = {
  influencerId: string;
  influencerName: string;
  influencerImg?: string | null;

  assignmentId?: string | null; // present after POST or from backend
  percentage: number;
  offerAmount: number;

  // UI state
  isAssigned: boolean; // true if assignmentId exists
  isDirty: boolean; // user edited after last sync
  saving?: boolean;
  deleting?: boolean;
};

export type QuoteState = "none" | "sent" | "confirmed";

export type AssignedRow = {
  influencerId: string;
  name: string;
  profileImg?: string | null;

  percentage: number;
  offerAmount: number;

  assignmentId?: string | null;
  isAssigned: boolean;

  committedPercentage: number;
  committedOfferAmount: number;

  saving?: boolean;
  deleting?: boolean;
};