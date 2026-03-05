import { apiClient } from "@/api/base/axios_client";


export async function postAssignInfluencer(payload: {
  campaignId: string;
  influencerId: string;
  percentage: number;
  offerAmount: number;
}) {
  // POST: /campaign/admin/assign
  return apiClient.post("/campaign/admin/assign", payload);
}

export async function patchAssignment(
  assignmentId: string,
  payload: { offerAmount: number; percentage: number }
) {
  // PATCH: /campaign/admin/assignment/:assignmentId
  return apiClient.patch(`/campaign/admin/assignment/${assignmentId}`, payload);
}

export async function deleteAssignment(assignmentId: string) {
  // DELETE: /campaign/admin/assignment/:assignmentId
  return apiClient.delete(`/campaign/admin/assignment/${assignmentId}`);
}

export const getDraftAssignments = async (campaignId: string) => {
  return apiClient.get(`/campaign/admin/get/${campaignId}/assignments`);
};