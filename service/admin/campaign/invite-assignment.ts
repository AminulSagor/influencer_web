import { serviceClient } from "@/service/base/axios_client";

export type InviteAssignmentMilestoneSplit = {
  milestoneId: string;
  amount: number;
};

export function inviteAssignment(
  assignmentId: string,
  payload: {
    milestoneSplits: InviteAssignmentMilestoneSplit[];
  }
) {
  return serviceClient.patch(
    `/campaign/admin/assignments/${assignmentId}/invite`,
    payload
  );
}