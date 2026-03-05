import { serviceClient } from "@/service/base/axios_client";

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

export async function getAdminUserCounts() {
  const res = await serviceClient.get<AdminUsersSummaryResponse>(
    "/influencer/admin/users/summary"
  );

  const roles = res.data.data.roles;

  return {
    influencer: roles.influencer ?? 0,
    agency: roles.agency ?? 0,
    brand: roles.client ?? 0,
  };
}