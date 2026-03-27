import axios from "axios";
import { serviceClient } from "../base/axios_client";
import {
  MilestoneListResponse,
  MilestoneDetailResponse,
  SubmitMilestonePayload,
  SubmitMilestoneResponse,
  ResubmitMilestonePayload,
  ResubmitMilestoneResponse,
  SubmissionListResponse,
  SubmissionDetailResponse,
  WithdrawableBalanceResponse,
  WithdrawalRequestPayload,
  WithdrawalRequestResponse,
} from "@/types/influencer/milestone_types";

export class MilestoneService {
  static async getJobMilestones(jobId: string): Promise<MilestoneListResponse> {
    try {
      const response = await serviceClient.get<MilestoneListResponse>(
        `/campaign/influencer/job/${encodeURIComponent(jobId)}/milestones`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Failed to fetch milestones";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async getMilestoneDetail(
    milestoneId: string
  ): Promise<MilestoneDetailResponse> {
    try {
      const response = await serviceClient.get<MilestoneDetailResponse>(
        `/campaign/influencer/milestone/${encodeURIComponent(milestoneId)}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch milestone details";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async submitMilestone(
    milestoneId: string,
    payload: SubmitMilestonePayload
  ): Promise<SubmitMilestoneResponse> {
    try {
      const response = await serviceClient.post<SubmitMilestoneResponse>(
        `/campaign/influencer/milestone/${encodeURIComponent(milestoneId)}/submit`,
        payload
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to submit milestone";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async resubmitMilestone(
    submissionId: string,
    payload: ResubmitMilestonePayload
  ): Promise<ResubmitMilestoneResponse> {
    try {
      const response = await serviceClient.patch<ResubmitMilestoneResponse>(
        `/campaign/influencer/submission/${encodeURIComponent(submissionId)}/resubmit`,
        payload
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to resubmit milestone";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async getMySubmissions(
    params?: { status?: string }
  ): Promise<SubmissionListResponse> {
    try {
      const response = await serviceClient.get<SubmissionListResponse>(
        "/campaign/influencer/submissions",
        { params }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch submissions";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async getSubmissionDetail(
    submissionId: string
  ): Promise<SubmissionDetailResponse> {
    try {
      const response = await serviceClient.get<SubmissionDetailResponse>(
        `/campaign/influencer/submissions/${encodeURIComponent(submissionId)}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch submission details";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async getWithdrawableBalance(
    campaignId: string
  ): Promise<WithdrawableBalanceResponse> {
    try {
      const response = await serviceClient.get<WithdrawableBalanceResponse>(
        `/campaign/influencer/campaign/${encodeURIComponent(campaignId)}/withdrawable-balance`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch withdrawable balance";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async requestWithdrawal(
    payload: WithdrawalRequestPayload
  ): Promise<WithdrawalRequestResponse> {
    try {
      const response = await serviceClient.post<WithdrawalRequestResponse>(
        "/campaign/influencer/withdrawal/request",
        payload
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to request withdrawal";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }
}
