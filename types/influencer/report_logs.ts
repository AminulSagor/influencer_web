export interface ReportLogItem {
    reportId: string;
    date: string;
    campaignName: string;
    milestoneTitle: string;
    feedback: string;
    actionTaken: "approve" | "decline" | "comment" | "status_changed";
    submissionStatus: "approved" | "declined" | "in_review";
    logStatus: "resolved" | "flagged" | "pending";
}

export interface ReportLogsMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ReportLogsResponse {
    success: boolean;
    data: ReportLogItem[];
    meta: ReportLogsMeta;
}
