import { ClientTradeLicenseUpdateInput } from "@/schemas/client/client-trade-license-update.schema";
import { serviceClient } from "@/service/base/axios_client";

export const updateClientTradeLicense = async (
  payload: ClientTradeLicenseUpdateInput,
): Promise<"success" | string> => {
  try {
    await serviceClient.patch("/client/profile/trade-license", payload);
    return "success";
  } catch (error: any) {
    return error?.response?.data?.message || "Failed to update trade license";
  }
};
