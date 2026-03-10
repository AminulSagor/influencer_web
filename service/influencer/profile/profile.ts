// service/influencer/profile/profile.ts

import { serviceClient } from "../../base/axios_client";
import {
  InfluencerProfileData
} from "../../../types/influencer/profile_type";

export const getInfluencerProfile = async (
): Promise<InfluencerProfileData> => {
  const response = await serviceClient.get(`/influencer/profile`);

  return response.data;
};
