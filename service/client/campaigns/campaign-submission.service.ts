import { AxiosResponse } from "axios";
import { ServiceResponse } from "@/types/service-response";
import {
  SubmissionSummary,
  ClientSubmissionDetailResponse,
} from "@/types/client/campaigns/campaign-submission.types";
import { serviceClient } from "@/service/base/axios_client";

export const campaignSubmissionService = {
  async getAgencyMilestoneSubmissionList(milestoneId: string) {
    const response: AxiosResponse<ServiceResponse<SubmissionSummary[]>> =
      await serviceClient.get(
        `/campaign/client/submissions/agency/${milestoneId}`,
      );

    return response.data;
  },

  async getClientSubmissionDetails(submissionId: string) {
    const response: AxiosResponse<
      ServiceResponse<ClientSubmissionDetailResponse>
    > = await serviceClient.get(`/campaign/submission/${submissionId}`);

    return response.data;
  },
};

export type ReviewSubmissionPayload =
  | {
      action: "approve";
      submissionIds?: string[];
    }
  | {
      action: "decline";
      reason: string;
      submissionIds?: string[];
    };

type ReviewSubmissionResponse = {
  id: string;
  status: string;
  reason?: string;
};

export async function reviewSubmission(
  submissionId: string,
  payload: ReviewSubmissionPayload,
) {
  console.log("id", submissionId);
  console.log("payload", payload);

  const res = await serviceClient.post<
    ServiceResponse<ReviewSubmissionResponse>
  >(`/campaign/client/submission/${submissionId}/review`, payload);

  return res.data;
}
