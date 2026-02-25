import { apiClient } from "@/api/base/axios_client";


export function inviteAssignment(jobId: string) {
  return apiClient.patch(`/campaign/admin/assignments/${jobId}/invite`);
}