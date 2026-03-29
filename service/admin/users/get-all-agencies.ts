import { serviceServer } from "@/service/base/axios_server";
import type {
  AgencyListItem,
  ListMeta,
} from "@/types/admin/user/user_type";

type BrowsingAgencyApiItem = {
  userId: string;
  profileId: string;
  name: string;
  avatar: string | null;
  niches: string[];
  rating: number;
  stats: {
    activeJob: number;
    jobDone: number;
    revenue: number;
  };
  status: string;
  isVerified: boolean;
};

type BrowsingAgenciesResponse = {
  data: BrowsingAgencyApiItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AgencyListResponse = {
  users: AgencyListItem[];
  meta: ListMeta;
};

type GetAllAgenciesParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  minRating?: number;
  minJobsDone?: number;
  minRevenue?: number;
  sortBy?: string;
  niche?: string;
};

export async function getAllAgencies({
  page = 1,
  limit = 10,
  search,
  status,
  minRating,
  minJobsDone,
  minRevenue,
  sortBy,
  niche,
}: GetAllAgenciesParams = {}): Promise<AgencyListResponse> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) query.set("search", search.trim());
  if (status?.trim()) query.set("status", status.trim());
  if (typeof minRating === "number") query.set("minRating", String(minRating));
  if (typeof minJobsDone === "number") {
    query.set("minJobsDone", String(minJobsDone));
  }
  if (typeof minRevenue === "number") {
    query.set("minRevenue", String(minRevenue));
  }
  if (sortBy?.trim()) query.set("sortBy", sortBy.trim());
  if (niche?.trim()) query.set("niche", niche.trim());

  const res = await serviceServer.get<BrowsingAgenciesResponse>(
    `/influencer/admin/browsing/agencies?${query.toString()}`
  );

  return {
    users: (res.data?.data ?? []).map((item) => ({
      id: item.profileId,
      userId: item.userId,
      name: item.name ?? "",
      image: item.avatar,
      niche: item.niches ?? [],
      rating: item.rating ?? 0,
      platforms: [],
      activeJobs: item.stats?.activeJob ?? 0,
      jobDone: item.stats?.jobDone ?? 0,
      revenue: item.stats?.revenue ?? 0,
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