import { ClientNidUpdateInput } from "@/schemas/client/client-nid-update.schema";
import { serviceClient } from "@/service/base/axios_client";

export const updateClientNid = async (
  payload: ClientNidUpdateInput,
): Promise<"success" | string> => {
  try {
    await serviceClient.patch("/client/profile/nid", payload);
    return "success";
  } catch (error: any) {
    return error?.response?.data?.message || "Failed to update NID";
  }
};
