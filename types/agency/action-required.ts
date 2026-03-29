export type ActionRequiredMeta = {
    rejectionReason?: string;
};

export type ActionRequiredItem = {
    type: "SUBMISSION" | "VERIFICATION" | string;
    title: string;
    description: string;
    link: string;
    priority: "HIGH" | "MEDIUM" | "LOW" | string;
    date: string;
    meta?: ActionRequiredMeta;
};

export type ActionRequiredResponse = {
    success: boolean;
    data: ActionRequiredItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
};