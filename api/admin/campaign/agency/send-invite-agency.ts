import { apiClient } from "@/api/base/axios_client";

export type InviteAgencyPayload = {
  campaignId: string;
  agencyId: string;
};

export const inviteAgency = async (payload: InviteAgencyPayload) => {
  // POST: /campaign/admin/invite-agency
  return apiClient.post("/campaign/admin/invite-agency", payload);
};