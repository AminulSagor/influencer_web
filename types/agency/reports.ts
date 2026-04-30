export type ReportStatus = "flagged" | "pending" | "resolved";

export type ReportItem = {
    reportId: string;
    campaignName: string;
    milestoneTitle: string;
    submissionDescription: string;
    status: ReportStatus | string;
    submissionStatus: string;
    priority: string;
    issueSummary: string;
    campaignId: string;
    milestoneId: string;
};

export type ReportsMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type ReportsResponse = {
    success: boolean;
    data: ReportItem[];
    meta: ReportsMeta;
};

export type GetReportsParams = {
    page: number;
    limit: number;
    search?: string;
    status?: ReportStatus;
};
