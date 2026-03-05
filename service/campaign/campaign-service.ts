
import axios from "axios";
import { serviceClient } from "../base/axios_client";
import { CampaignBasicPayload, CampaignBasicResponse } from "@/types/campaign/step1_campaign_basic_type";
import { StepTwoPayload } from "@/types/campaign/step2_campaign_type";

export class CampaignService {
  static async createBasicCampaign(
    payload: CampaignBasicPayload
  ): Promise<CampaignBasicResponse> {
    
    try {
      const response = await serviceClient.post<CampaignBasicResponse>(
        "/campaign",
        payload
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        
        const message = 
          error.response?.data?.message ||
          error.message ||
          "Failed to create campaign";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async updateStepTwo(
    campaignId: string,
    payload: StepTwoPayload
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await serviceClient.patch(`/campaign/${campaignId}/step-2`, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Failed to update Step 2";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }
// Fetch product types from backend
  static async getProductTypes(): Promise<string[]> {
    try {
      const response = await serviceClient.get("/campaign/get/product-types");
      if (Array.isArray(response.data)) {
        return response.data.map((item: { name: string }) => item.name);
      }
      return [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Failed to fetch product types";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }

  // Fetch campaign niches from backend
  static async getCampaignNiches(): Promise<string[]> {
    try {
      const response = await serviceClient.get("/campaign/get/niches");
      if (Array.isArray(response.data)) {
        return response.data.map((item: { name: string }) => item.name);
      }
      return [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Failed to fetch campaign niches";
        throw new Error(message);
      }
      throw new Error("An unexpected error occurred");
    }
  }
}