import { serviceClient } from "@/service/base/axios_client";
import { InfluencerVerificationProfileResponse } from "@/types/admin/user/influencer-verification-profile_type";


export async function getInfluencerVerificationProfile(userId: string) {
  const res = await serviceClient.get(
    `/influencer/admin/verification/profile/${userId}`
  );

  return res.data as InfluencerVerificationProfileResponse;
}