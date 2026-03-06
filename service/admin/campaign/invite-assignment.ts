// app/service/admin/campaign/invite-assignment.ts
import { serviceClient } from "@/service/base/axios_client";

export function inviteAssignment(assignmentId: string) {
  return serviceClient.patch(`/campaign/admin/assignments/${assignmentId}/invite`);
}