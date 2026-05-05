import { serviceClient } from "@/service/base/axios_client";
import type {
    GetAgencyMilestoneDetailsResponse,
    SubmitAgencyMilestonePayload,
    SubmitAgencyMilestoneResponse,
    UpdateAgencySubmissionResultsPayload,
    UpdateAgencySubmissionResultsResponse,
} from "@/types/agency/campaign/milestone-submission.types";

export const milestoneSubmissionService = {
    async getMilestoneDetails(
        milestoneId: string
    ): Promise<GetAgencyMilestoneDetailsResponse> {
        const response = await serviceClient.get(`/campaign/milestone/${milestoneId}`);
        return response.data;
    },

    async submitMilestone(
        milestoneId: string,
        payload: SubmitAgencyMilestonePayload
    ): Promise<SubmitAgencyMilestoneResponse> {
        const response = await serviceClient.post(
            `/campaign/agency/milestone/${milestoneId}/submit`,
            payload
        );
        return response.data;
    },

    async resubmitMilestone(
        submissionId: string,
        payload: SubmitAgencyMilestonePayload
    ): Promise<SubmitAgencyMilestoneResponse> {
        const response = await serviceClient.patch(
            `/campaign/agency/submission/${encodeURIComponent(submissionId)}/resubmit`,
            payload
        );
        return response.data;
    },

    async updateSubmissionResults(
        submissionId: string,
        payload: UpdateAgencySubmissionResultsPayload
    ): Promise<UpdateAgencySubmissionResultsResponse> {
        const response = await serviceClient.patch(
            `/campaign/agency/submission/${encodeURIComponent(submissionId)}/results`,
            payload
        );
        return response.data;
    },
};
