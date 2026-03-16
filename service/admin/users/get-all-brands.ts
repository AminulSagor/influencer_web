import { serviceServer } from "@/service/base/axios_server";
import type {
  BrandListItem,
  ListMeta,
} from "@/types/admin/user/user_type";

type BrowsingClientApiItem = {
  userId: string;
  profileId: string;
  name: string;
  avatar: string | null;
  niches: string[];
  platforms: string[];
  socialLinks: {
    url: string;
    status: string;
    platform: string;
  }[];
  stats: {
    activeJob: number;
    jobPlaced: number;
    totalSpent: number;
  };
  status: string;
  isVerified: boolean;
};

type BrowsingClientsResponse = {
  data: BrowsingClientApiItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type BrandListResponse = {
  users: BrandListItem[];
  meta: ListMeta;
};

type GetAllBrandsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  minJobsPlaced?: number;
  minSpent?: number;
  sortBy?: string;
};

export async function getAllBrands({
  page = 1,
  limit = 10,
  search,
  status,
  minJobsPlaced,
  minSpent,
  sortBy,
}: GetAllBrandsParams = {}): Promise<BrandListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) query.set("search", search.trim());
  if (status?.trim()) query.set("status", status.trim());
  if (typeof minJobsPlaced === "number") {
    query.set("minJobsPlaced", String(minJobsPlaced));
  }
  if (typeof minSpent === "number") {
    query.set("minSpent", String(minSpent));
  }
  if (sortBy?.trim()) query.set("sortBy", sortBy.trim());

  const res = await serviceServer.get<BrowsingClientsResponse>(
    `/influencer/admin/browsing/clients?${query.toString()}`
  );

  return {
    users: (res.data?.data ?? []).map((item) => ({
      id: item.profileId,
      userId: item.userId,
      name: item.name ?? "",
      image: item.avatar,
      niche: item.niches ?? [],
      platforms: [...new Set(item.platforms ?? [])],
      activeJobs: item.stats?.activeJob ?? 0,
      jobPlaced: item.stats?.jobPlaced ?? 0,
      totalSpent: item.stats?.totalSpent ?? 0,
      status: item.status ?? "Pending",
      isVerified: item.isVerified ?? false,
    })),
    meta: {
      total: res.data?.meta?.total ?? 0,
      page: res.data?.meta?.page ?? page,
      limit: res.data?.meta?.limit ?? limit,
      totalPages: res.data?.meta?.totalPages ?? 1,
    },
  };
}