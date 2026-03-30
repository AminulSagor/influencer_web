import { serviceClient } from "@/service/base/axios_client";

export type UpdateClientProfileAddressBody = {
  thana: string;
  zilla: string;
  fullAddress: string;
};

export const updateClientProfileAddress = async (
  body: UpdateClientProfileAddressBody,
): Promise<"success" | string> => {
  try {
    await serviceClient.patch("/client/profile/address", body);
    return "success";
  } catch {
    return "Failed to update address";
  }
};