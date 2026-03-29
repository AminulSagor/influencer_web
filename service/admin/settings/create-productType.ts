import { serviceClient } from "@/service/base/axios_client";

export type CreateProductTypePayload = {
  name: string;
};

export type CreateProductTypeResponse = {
  success: boolean;
  id: string;
  message: string;
};

export const createProductType = async (
  payload: CreateProductTypePayload
): Promise<CreateProductTypeResponse> => {
  const res = await serviceClient.post(
    "/influencer/admin/settings/product-types",
    payload
  );

  return res.data;
};