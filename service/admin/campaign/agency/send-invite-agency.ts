import { serviceClient } from "@/service/base/axios_client";

export type InviteAgencyPayload = {
  campaignId: string;
  agencyId: string;
};

export const inviteAgency = async (payload: InviteAgencyPayload) => {
  // POST: /campaign/admin/invite-agency
  return serviceClient.post("/campaign/admin/invite-agency", payload);
};