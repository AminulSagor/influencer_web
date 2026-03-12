import { AxiosResponse } from "axios";
import { ServiceResponse } from "@/types/service-response";
import {
  SubmissionSummary,
  ClientSubmissionDetailResponse,
} from "@/types/client/campaigns/campaign-submission.types";
import { serviceClient } from "@/service/base/axios_client";

type SubmissionListParams = {
  campaignId?: string;
  milestoneId?: string;
};

export const campaignSubmissionService = {
  async getSubmissionList(params?: SubmissionListParams) {
    const response: AxiosResponse<ServiceResponse<SubmissionSummary[]>> =
      await serviceClient.get("/campaign/client/submissions", {
        params,
      });

    return response.data;
  },

  async getClientSubmissionDetails(submissionId: string) {
    const response: AxiosResponse<
      ServiceResponse<ClientSubmissionDetailResponse>
    > = await serviceClient.get(`/campaign/client/submissions/${submissionId}`);

    return response.data;
  },
};
