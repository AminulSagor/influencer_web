import { serviceClient } from "@/service/base/axios_client";

export type UpdateClientProfileBody = {
  brandName: string;
  firstName: string;
  lastName: string;
  profileImg: string;
};

export const updateClientProfile = async (
  body: UpdateClientProfileBody,
): Promise<"success" | string> => {
  try {
    await serviceClient.patch("/client/profile", body);
    return "success";
  } catch {
    return "Failed to update profile";
  }
};