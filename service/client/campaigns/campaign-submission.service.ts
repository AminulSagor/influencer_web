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
      campaignType?: string;
      milestoneId?: string; // Add milestoneId for paid_ad
    }
  | {
      action: "decline";
      reason: string;
      submissionIds?: string[];
      campaignType?: string;
      milestoneId?: string; // Add milestoneId for paid_ad
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
  // Determine which endpoint to use based on campaign type
  const isInfluencerPromotion =
    String(payload.campaignType ?? "").toLowerCase() === "influencer_promotion";

  let endpoint: string;
  let requestPayload: any;

  if (isInfluencerPromotion) {
    // Influencer promotion uses single review endpoint with submissionId
    endpoint = `/campaign/client/submission/${submissionId}/review`;

    // For influencer promotion, we only send the action and reason (if declining)
    requestPayload = {
      action: payload.action,
      ...(payload.action === "decline" && { reason: payload.reason }),
    };
  } else {
    // Paid ad uses bulk-review endpoint with milestoneId
    endpoint = `/campaign/client/submissions/${payload.milestoneId}/bulk-review`;

    // For paid ad, we include submissionIds if provided
    requestPayload = {
      action: payload.action,
      ...(payload.action === "decline" && { reason: payload.reason }),
      ...(payload.submissionIds && { submissionIds: payload.submissionIds }),
    };
  }

  const res = await serviceClient.post<
    ServiceResponse<ReviewSubmissionResponse>
  >(endpoint, requestPayload);

  return res.data;
}
