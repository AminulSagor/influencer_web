import type { ServiceResponse } from "@/types/service-response";
import { serviceClient } from "@/service/base/axios_client";
import { ClientNotification } from "@/types/client/notification/notifications";

export const getClientNotifications = async (
  page = 1,
  limit = 10,
): Promise<ServiceResponse<ClientNotification[], { total: number; unreadCount: number; page: number; limit: number }>> => {
  const response = await serviceClient.get<
    ServiceResponse<
      ClientNotification[],
      { total: number; unreadCount: number; page: number; limit: number }
    >
  >(`/client/notifications?page=${page}&limit=${limit}`);

  return response.data;
};