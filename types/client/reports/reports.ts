import { PaginationMeta } from "@/types/service-response";

export type ReportStatus = "Pending" | "Resolved";
export type ReportStatusFilter = "Pending" | "Resolved" | "all";

export type ClientReportItem = {
  reportId: string;
  campaignName: string;
  milestoneTitle: string;
  submissionDate: string;
  status: ReportStatus;
  details: string;
  amount: string;
};

export type ClientReportsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: Exclude<ReportStatusFilter, "all">;
};

export type ClientReportsResponseData = ClientReportItem[];

export type ClientReportsResult = {
  items: ClientReportItem[];
  meta: PaginationMeta;
};
