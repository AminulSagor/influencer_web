import { serviceClient } from "@/service/base/axios_client";

export type UpdateListItemPayload = {
  name: string;
};

export type UpdateListItemResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
  };
};

export const updateListItem = async (
  itemId: string,
  payload: UpdateListItemPayload
): Promise<UpdateListItemResponse> => {
  const res = await serviceClient.patch(
    `/influencer/admin/settings/list-item/${itemId}`,
    payload
  );

  return res.data;
};