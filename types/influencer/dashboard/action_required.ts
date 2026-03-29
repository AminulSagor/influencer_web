export interface ActionRequiredItem {
    type: string;
    title: string;
    description: string;
    link: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    date: string;
}

export interface ActionRequiredMeta {
    total: number;
    page: number;
    limit: number;
}

export interface ActionRequiredResponse {
    success: boolean;
    data: ActionRequiredItem[];
    meta: ActionRequiredMeta;
}
