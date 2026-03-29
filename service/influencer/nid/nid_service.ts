import { serviceClient } from "../../base/axios_client";
import {
  nidUpdateSchema,
  nidUpdateResponseSchema,
  type NidUpdateRequest,
  type NidUpdateResponse,
} from "@/schemas/influencer/nid_validation";

/**
 * Update influencer NID information
 * @param data - NID update data containing nidNumber, nidFrontImg, nidBackImg
 * @returns Promise with update response
 */
export const updateNid = async (
  data: NidUpdateRequest
): Promise<NidUpdateResponse> => {
  const validatedData = nidUpdateSchema.parse(data);
  const response = await serviceClient.patch(
    `/influencer/profile/edit/nid`,
    validatedData
  );
  return nidUpdateResponseSchema.parse(response.data);
};
