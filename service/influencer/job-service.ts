import axios from "axios";
import { serviceClient } from "../base/axios_client";
import {
  JobListParams,
  JobListResponse,
  JobCountsResponse,
  JobDetailResponse,
  AcceptJobPayload,
  AcceptJobResponse,
  DeclineJobPayload,
  DeclineJobResponse,
  CompleteJobPayload,
  CompleteJobResponse,
  ReportProductResponse,
  AddressListResponse,
} from "@/types/influencer/job_types";

export class InfluencerJobService {
  static async getJobs(params?: JobListParams): Promise<JobListResponse> {
    try {
      const response = await serviceClient.get<JobListResponse>(
        "/campaign/influencer/jobs",
        { params }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Failed to fetch jobs";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async getJobCounts(): Promise<JobCountsResponse> {
    try {
      const response = await serviceClient.get<JobCountsResponse>(
        "/campaign/influencer/jobs/counts"
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Failed to fetch job counts";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async getJobDetail(jobId: string): Promise<JobDetailResponse> {
    try {
      const response = await serviceClient.get<JobDetailResponse>(
        `/campaign/influencer/job/${encodeURIComponent(jobId)}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Failed to fetch job details";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async acceptJob(
    jobId: string,
    payload?: AcceptJobPayload
  ): Promise<AcceptJobResponse> {
    try {
      const response = await serviceClient.post<AcceptJobResponse>(
        `/campaign/influencer/job/${encodeURIComponent(jobId)}/accept`,
        payload || {}
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Failed to accept job";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async declineJob(
    jobId: string,
    payload?: DeclineJobPayload
  ): Promise<DeclineJobResponse> {
    try {
      const response = await serviceClient.post<DeclineJobResponse>(
        `/campaign/influencer/job/${encodeURIComponent(jobId)}/decline`,
        payload || {}
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Failed to decline job";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async completeJob(
    jobId: string,
    payload?: CompleteJobPayload
  ): Promise<CompleteJobResponse> {
    try {
      const response = await serviceClient.post<CompleteJobResponse>(
        `/campaign/influencer/job/${encodeURIComponent(jobId)}/complete`,
        payload || {}
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Failed to complete job";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async reportProductNotReceived(
    assignmentId: string
  ): Promise<ReportProductResponse> {
    try {
      const response = await serviceClient.post<ReportProductResponse>(
        `/campaign/influencer/job/${encodeURIComponent(assignmentId)}/report-product`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to report product issue";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async getAddresses(): Promise<AddressListResponse> {
    try {
      const response = await serviceClient.get<AddressListResponse>(
        "/campaign/influencer/addresses"
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Failed to fetch addresses";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }
}
