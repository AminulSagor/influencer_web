import { serviceClient } from "../../base/axios_client";
import {
  AddAddressRequest,
  UpdateAddressRequest,
  AddressResponse,
} from "../../../schemas/influencer/address-validation";

/**
 * Add a new address
 * POST /influencer/profile/address
 */
export const addAddress = async (
  data: AddAddressRequest
): Promise<AddressResponse> => {
  const response = await serviceClient.post(`/influencer/profile/address`, data);
  return response.data;
};

/**
 * Update an existing address
 * PATCH /influencer/profile/address/:addressName
 */
export const updateAddress = async (
  currentAddressName: string,
  data: UpdateAddressRequest
): Promise<AddressResponse> => {
  const response = await serviceClient.patch(
    `/influencer/profile/address/${encodeURIComponent(currentAddressName)}`,
    data
  );
  return response.data;
};

/**
 * Delete an existing address
 * DELETE /influencer/profile/address/:addressName
 */
export const deleteAddress = async (
  addressName: string
): Promise<AddressResponse> => {
  const response = await serviceClient.delete(
    `/influencer/profile/address/${encodeURIComponent(addressName)}`
  );
  return response.data;
};
