import { serviceClient } from "@/service/base/axios_client";

export type MilestoneReport = {
  id: string;
  milestoneId: string;
  authorId: string;
  content: string;
  date: string;
};

export type GetMilestoneReportsResponse = {
  success: boolean;
  data: MilestoneReport[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export async function getMilestoneReports(
  milestoneId: string
): Promise<GetMilestoneReportsResponse> {
  const res = await serviceClient.get(
    `/campaign/admin/milestones/${milestoneId}/reports`
  );

  return res.data;
}
