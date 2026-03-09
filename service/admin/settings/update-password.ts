import { serviceClient } from "@/service/base/axios_client";


export type UpdatePasswordPayload = {
  email: string;
  oldPassword: string;
  newPassword: string;
};

export type UpdatePasswordResponse = {
  success?: boolean;
  message: string;
};

export const updatePassword = async (
  payload: UpdatePasswordPayload
): Promise<UpdatePasswordResponse> => {
  const res = await serviceClient.patch(
    "/influencer/admin/settings/security/password",
    payload
  );

  return res.data;
};