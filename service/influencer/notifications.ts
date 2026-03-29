import { serviceClient } from "@/service/base/axios_client";
import { NotificationsResponse } from "@/types/influencer/dashboard/notifications";

export type NotificationFilter = "new" | "all" | "read";

export const getNotifications = async (filter: NotificationFilter = "new", page = 1): Promise<NotificationsResponse> => {
    const response = await serviceClient.get(`/influencer/notifications`, {
        params: { filter, page },
    });
    return response.data;
};
