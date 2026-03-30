import { serviceClient } from "@/service/base/axios_client";

export type UpdateProfileSocialBody = {
  website: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
};

export const updateProfileSocial = async (
  body: UpdateProfileSocialBody,
): Promise<string> => {
  try {
    await serviceClient.patch("/client/profile/social", body);
    return "success";
  } catch {
    return "Failed to update profile social info";
  }
};