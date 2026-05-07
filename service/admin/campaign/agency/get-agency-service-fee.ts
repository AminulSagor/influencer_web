import { serviceClient } from "@/service/base/axios_client";


export const getAgencyServiceFee = async (profileId: string) => {
  const res = await serviceClient.get(`/campaign/admin/agency/${profileId}/service-fee`);
  return res?.data; 
};