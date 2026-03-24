import { serviceClient } from "@/service/base/axios_client";

interface BlockUnblockResponse {
  success: boolean;
  message: string;
  isBlocked: boolean;
}

export async function blockUnblockUser(userId: string) {
  const res = await serviceClient.patch<BlockUnblockResponse>(
    `/influencer/admin/browsing/influencer/${userId}/block`
  );

  return res.data;
}
