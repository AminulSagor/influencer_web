import { serviceClient } from "@/service/base/axios_client";

export interface NotificationItem {
  id: string;
  userId: string;
  userRole?: string;
  title: string;
  message: string;
  type?: string;
  isRead?: boolean;
  metadata?: any;
  createdAt: string;
}

interface NotificationsResponse {
  data: NotificationItem[];
  meta: {
    total: number;
    unreadCount: number;
    page: number;
    limit: number;
    totalPages?: number;
  };
}

export const getNotifications = async (
  page = 1,
  limit = 10
): Promise<NotificationsResponse> => {
  const res = await serviceClient.get<NotificationsResponse>(
    `/notifications`,
    { params: { page, limit } }
  );
  return res.data;
};

export const markNotificationAsRead = async (id: string): Promise<any> => {
  const res = await serviceClient.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsAsRead = async (): Promise<any> => {
  const res = await serviceClient.patch(`/notifications/read-all`);
  return res.data;
};
