import { serviceServer } from "@/service/base/axios_server";

export type VerificationCardLabel = "Influencer" | "Brand" | "Agency";
export type VerificationTabKey = "influencer" | "brand" | "agency";

export type VerificationCardDataType = {
  id: number;
  label: VerificationCardLabel;
  count: number;
  status: "Pending";
  key: VerificationTabKey;
};

export type VerificationTableRow = {
  id: string;
  name: string;
  niche: string[];
  pendingItems: number;
  approvalProgress: number;
  isVerified: boolean;
  email?: string;
  phone?: string;
};

export type VerificationTableData = Record<
  VerificationCardLabel,
  VerificationTableRow[]
>;

export type VerificationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type VerificationTableMeta = Record<
  VerificationCardLabel,
  VerificationMeta
>;

export type VerificationFilterParams = {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export type PendingAgencyItem = {
  userId: string;
  agencyName: string;
  email: string;
  phone: string;
  niches: string[];
  pendingItemsCount: number;
  approvalProgress: number;
  isVerified: boolean;
};

export type PendingInfluencerItem = {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  niches: string[];
  pendingItemsCount: number;
  approvalProgress: number;
  isVerified: boolean;
};

export type PendingBrandItem = {
  userId: string;
  brandName: string;
  email: string;
  phone: string;
  pendingItemsCount: number;
  approvalProgress: number;
  isVerified: boolean;
};

const buildVerificationParams = (params?: VerificationFilterParams) => ({
  page: params?.page ?? 1,
  limit: params?.limit ?? 10,
  ...(params?.search ? { search: params.search } : {}),
  ...(params?.startDate ? { startDate: params.startDate } : {}),
  ...(params?.endDate ? { endDate: params.endDate } : {}),
});

export const getPendingVerificationAgencies = async (
  params?: VerificationFilterParams
) => {
  const res = await serviceServer.get("/influencer/admin/verification/agencies", {
    params: buildVerificationParams(params),
  });

  return res.data as {
    data: PendingAgencyItem[];
    meta: VerificationMeta;
  };
};

export const getPendingVerificationInfluencers = async (
  params?: VerificationFilterParams
) => {
  const res = await serviceServer.get(
    "/influencer/admin/verification/influencers",
    {
      params: buildVerificationParams(params),
    }
  );

  return res.data as {
    data: PendingInfluencerItem[];
    meta: VerificationMeta;
  };
};

export const getPendingVerificationBrands = async (
  params?: VerificationFilterParams
) => {
  const res = await serviceServer.get("/influencer/admin/verification/clients", {
    params: buildVerificationParams(params),
  });

  return res.data as {
    data: PendingBrandItem[];
    meta: VerificationMeta;
  };
};