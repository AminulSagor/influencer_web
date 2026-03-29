export type ReportStatus = "Pending" | "Resolved";
export type ReportUserType = "AGENCY" | "INFLUENCER" | "CLIENT";

export interface ReportItem {
  reportId: string;
  campaignName: string;
  status: ReportStatus;
  relatedEntity: {
    type: string;
    name: string;
  };
  milestone: string;
}

export interface ReportStats {
  pending: number;
  resolved: number;
}

export interface ReportMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportsResponse {
  success: boolean;
  stats: ReportStats;
  data: ReportItem[];
  meta: ReportMeta;
}

export interface GetReportsParams {
  page?: number;
  limit?: number;
  userType?: ReportUserType;
  status?: ReportStatus;
  search?: string;
}