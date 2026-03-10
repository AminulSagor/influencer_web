import { ClientTinUpdateInput } from "@/schemas/client/client-tin-update.schema";
import { serviceClient } from "@/service/base/axios_client";

export const updateClientTin = async (
  payload: ClientTinUpdateInput,
): Promise<"success" | string> => {
  try {
    await serviceClient.patch("/client/profile/tin", payload);
    return "success";
  } catch (error: any) {
    return error?.response?.data?.message || "Failed to update TIN";
  }
};
