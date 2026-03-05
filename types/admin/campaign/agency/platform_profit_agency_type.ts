export type Statistics = { label: string; value: number };

export type AgencyOptionservice = {
  id: string;
  agencyName?: string;
  fullName?: string;
  logo?: string | null;
};

export type PreferredAgency = { id: string; name: string; image?: string | null };

export type Row = {
  id: string;
  name: string;
  logo?: string | null;

  defaultPercentage: number;
  assignPercentage: number;
  profitAmount: number;
};

export type DraftAssignedAgencyItem = {
  agencyId?: string;
  id?: string;

  // ✅ keys from your draft assigned service response
  defaultPercentage?: number;
  assignPercentage?: number;
  agencyProfit?: number;

  // ✅ keep older/alternate keys (backend variations)
  assignedServiceFeePercent?: number;
  assignedPercentage?: number;
  serviceFeePercent?: number;

  agencyName?: string;
  name?: string;
  fullName?: string;
  logo?: string | null;
};