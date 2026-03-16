import { serviceClient } from "@/service/base/axios_client";

export type DeleteListItemResponse = {
  success: boolean;
  message: string;
};

export const deleteListItem = async (
  itemId: string
): Promise<DeleteListItemResponse> => {
  const res = await serviceClient.delete(
    `/influencer/admin/settings/list-item/${itemId}`
  );

  return res.data;
};