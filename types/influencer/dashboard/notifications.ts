export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    type: string;
    createdAt: string;
    metadata: Record<string, unknown> | null;
}

export interface NotificationsMeta {
    total: number;
    page: number;
    limit: number;
    filter: string;
}

export interface NotificationsResponse {
    success: boolean;
    data: NotificationItem[];
    meta: NotificationsMeta;
}
