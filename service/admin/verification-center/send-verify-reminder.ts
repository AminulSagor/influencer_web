import { serviceClient } from "@/service/base/axios_client";

export type VerifyReminderTargetRole = "influencer" | "agency" | "client";

interface SendVerifyReminderPayload {
  userId: string;
  targetRole: VerifyReminderTargetRole;
  title: string;
  message: string;
}

interface SendVerifyReminderResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export const sendVerifyReminder = async ({
  userId,
  targetRole,
  title,
  message,
}: SendVerifyReminderPayload): Promise<SendVerifyReminderResponse> => {
  const res = await serviceClient.post<SendVerifyReminderResponse>(
    `/influencer/admin/notifications/verify-reminder/${userId}`,
    {
      targetRole,
      title,
      message,
    }
  );

  return res.data;
};