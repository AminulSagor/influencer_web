import { serviceClient } from "@/service/base/axios_client";

export const getInfluencerPayoutProfile = async (profileId: string) => {
  const res = await serviceClient.get(
    `/influencer/admin/admin/payouts/profile/${profileId}`
  );
  return res.data;
};