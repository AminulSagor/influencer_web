import { serviceServer } from "@/service/base/axios_server";


export interface UserOverviewStats {
  role: "client" | "influencer" | string;
  moneyMetric: string;
  moneyValue: number;
  jobMetric: string;
  jobValue: number;
  activeJobValue: number;
}

interface UserOverviewStatsResponse {
  success: boolean;
  data: UserOverviewStats;
}

export const getUserOverviewStats = async (
  userId: string
): Promise<UserOverviewStats | null> => {
  try {
    const res = await serviceServer.get<UserOverviewStatsResponse>(
      `/influencer/admin/users/${userId}/overview-stats`
    );

    return res.data?.data ?? null;
  } catch (error) {
    console.error("getUserOverviewStats failed:", error);
    return null;
  }
};