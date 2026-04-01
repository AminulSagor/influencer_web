import { serviceClient } from "@/service/base/axios_client";
import { BrandProfile } from "@/types/client/profile/profile";

export const getProfile = async (): Promise<BrandProfile | string> => {
  try {
    const { data } = await serviceClient.get<BrandProfile>("/client/profile");
    return data;
  } catch {
    return "Failed to fetch profile";
  }
};
