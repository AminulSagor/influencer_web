import { serviceClient } from "@/service/base/axios_client";

export type UserChartDateRange =
  | "today"
  | "last_3_days"
  | "last_7_days"
  | "last_15_days"
  | "last_30_days"
  | "last_1_year"
  | "lifetime";

export type UserChartStatsResponse = {
  success: boolean;
  filter: {
    dateRange: UserChartDateRange | string;
  };
  data: {
    role: "client" | "influencer" | "agency";
    positiveLabel: string;
    negativeLabel: string;
    chartData: {
      label: string;
      value: number;
      color: string;
    }[];
  };
};

export async function getUserChartStats(
  userId: string,
  dateRange: UserChartDateRange
) {
  const res = await serviceClient.get<UserChartStatsResponse>(
    `/influencer/admin/users/${userId}/chart-stats?dateRange=${dateRange}`
  );

  return res.data;
}