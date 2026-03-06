import { serviceClient } from "@/service/base/axios_client";


export type AssignAgencyPayload = {
  campaignId: string;
  assignments: Array<{
    agencyId: string;
    assignedServiceFeePercent: number;
  }>;
};

export async function assignAgencies(payload: AssignAgencyPayload) {
  return serviceClient.post("/campaign/admin/assign-agency", payload);
}