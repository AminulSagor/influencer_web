// app/api/admin/campaign/invite-assignment.ts
import { apiClient } from "@/api/base/axios_client";

export function inviteAssignment(assignmentId: string) {
  return apiClient.patch(`/campaign/admin/assignments/${assignmentId}/invite`);
}