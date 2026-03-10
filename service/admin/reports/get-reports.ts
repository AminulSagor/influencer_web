import { serviceServer } from "@/service/base/axios_server";
import { GetReportsParams, ReportsResponse } from "@/types/admin/reports/reports_type";

const buildQuery = (params: GetReportsParams = {}) => {
  const query = new URLSearchParams();

  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 10));

  if (params.userType) query.set("userType", params.userType);
  if (params.status) query.set("status", params.status);
  if (params.search?.trim()) query.set("search", params.search.trim());

  return query.toString();
};

export const getReports = async (
  params: GetReportsParams = {}
): Promise<ReportsResponse> => {
  const query = buildQuery(params);
  const res = await serviceServer.get(`/influencer/admin/reports?${query}`);
  return res.data;
};