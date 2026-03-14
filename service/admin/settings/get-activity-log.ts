import { serviceServer } from "@/service/base/axios_server";

export type ActivityLogItem = {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  status: "success" | "failed" | "password" | string;
  timestamp: string;
};

export type ActivityLogResponse = {
  data: ActivityLogItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

export const getActivityLog = async (): Promise<ActivityLogResponse> => {
  const res = await serviceServer.get(
    "/influencer/admin/settings/security/activity-log"
  );

  return res.data;

  // if wrapped:
  // return res.data.data;
};