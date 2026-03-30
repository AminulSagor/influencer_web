import { ClientBinUpdateInput } from "@/schemas/client/client-bin-update.schema";
import { serviceClient } from "@/service/base/axios_client";

export const updateClientBin = async (
  payload: ClientBinUpdateInput,
): Promise<"success" | string> => {
  try {
    await serviceClient.patch("/client/profile/bin", payload);
    return "success";
  } catch (error: any) {
    return error?.response?.data?.message || "Failed to update BIN";
  }
};
