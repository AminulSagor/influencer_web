import { serviceServer } from "@/service/base/axios_server";

export type ProductTypeItem = {
  id: string;
  name: string;
};

export const getProductTypes = async (): Promise<ProductTypeItem[]> => {
  const res = await serviceServer.get(
    "/influencer/admin/settings/product-types"
  );

  return res.data;
};