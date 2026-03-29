import { serviceClient } from "@/service/base/axios_client";

type NotifyDuePayload = {
  clientId: string;
  campaignId: string;
};

type NotifyDueResponse = {
  success: boolean;
  data: string;
  message: string;
};

export const notifyDueClient = async (
  payload: NotifyDuePayload
): Promise<NotifyDueResponse> => {
  const res = await serviceClient.post<NotifyDueResponse>(
    "/influencer/admin/finance/notify-due",
    payload
  );

  return res.data;
};