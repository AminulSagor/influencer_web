import { serviceClient } from "@/service/base/axios_client";

export type AdminAgencyProfileResponse = {
  success: boolean;
  message?: string;
  data: {
    userid: string;
    profileid: string;
    name: string;
    image: string | null;
    isBlocked: boolean;
    role: string;
  };
};

export async function getAdminAgencyProfile(profileId: string) {
  if (!profileId) throw new Error("profileId is required");

  const res = await serviceClient.get<AdminAgencyProfileResponse>(
    `/influencer/admin/user/profile/${profileId}`
  );

  return res.data;
}