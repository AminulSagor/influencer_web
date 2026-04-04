import { serviceClient } from "@/service/base/axios_client";
import type {
    GetAgencyMilestoneDetailsResponse,
    GetMilestoneSubmissionsResponse,
    SubmitAgencyMilestonePayload,
    SubmitAgencyMilestoneResponse,
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

    async getMilestoneSubmissions(
        milestoneId: string
    ): Promise<GetMilestoneSubmissionsResponse> {
        const response = await serviceClient.get(
            `/campaign/get/milestones/${milestoneId}/submissions`
        );
        return response.data;
    },
};