import { serviceServer } from "@/service/base/axios_server";
import { InfluencerListItem, ListMeta } from "@/types/admin/user/user_type";

type BrowsingInfluencerApiItem = {
  userId: string;
  name: string;
  avatar: string | null;
  niches: string[];
  skills: string[];
  rating: number;
  platforms: string[];
  stats: {
    activeJob: number;
    jobDone: number;
    revenue: number;
  };
  status: string;
  isVerified: boolean;
};

type GetAllInfluencersResponse = {
  data: BrowsingInfluencerApiItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type InfluencerListResponse = {
  users: InfluencerListItem[];
  meta: ListMeta;
};

export async function getAllInfluencers(
  page = 1,
  limit = 10
): Promise<InfluencerListResponse> {
  const res = await serviceServer.get<GetAllInfluencersResponse>(
    `/influencer/admin/browsing/influencers?page=${page}&limit=${limit}`
  );

  return {
    users: (res.data?.data ?? []).map((item) => ({
      id: item.userId,
      name: item.name,
      image: item.avatar,
      niche: item.niches ?? [],
      rating: item.rating ?? 0,
      platforms: item.platforms ?? [],
      activeJobs: item.stats?.activeJob ?? 0,
      jobDone: item.stats?.jobDone ?? 0,
      revenue: item.stats?.revenue ?? 0,
      status: item.status ?? "Pending",
      isVerified: item.isVerified ?? false,
      skills: item.skills ?? [],
    })),
    meta: {
      total: res.data?.meta?.total ?? 0,
      page: res.data?.meta?.page ?? page,
      limit: res.data?.meta?.limit ?? limit,
      totalPages: res.data?.meta?.totalPages ?? 1,
    },
  };
}