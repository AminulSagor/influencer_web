export type AgencyDraftRow = {
  id: string; // ✅ this is the agencyId (from your response)

  agencyName?: string;
  firstName?: string;
  lastName?: string;
  logo?: string | null;

  defaultPercentage?: number;
  assignPercentage?: number;
  agencyProfit?: number;

  offerId?: string;
  status?: string; // "draft"
  isDeclined?: boolean;
  invitedAt?: string | null;
};