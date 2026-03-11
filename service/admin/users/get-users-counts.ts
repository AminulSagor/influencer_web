import { serviceServer } from "@/service/base/axios_server";

type AdminUsersSummaryResponse = {
  success: boolean;
  data: {
    total: number;
    roles: {
      influencer: number;
      client: number;
      agency: number;
      admin: number;
    };
  };
};

export type AdminUserCounts = {
  influencer: number;
  agency: number;
  brand: number;
};

export async function getAdminUserCounts(): Promise<AdminUserCounts> {
  const res = await serviceServer.get<AdminUsersSummaryResponse>(
    "/influencer/admin/users/summary"
  );

  const roles = res.data?.data?.roles;

  return {
    influencer: roles?.influencer ?? 0,
    agency: roles?.agency ?? 0,
    brand: roles?.client ?? 0,
  };
}