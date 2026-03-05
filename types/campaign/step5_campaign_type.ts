// types/campaign/step5_campaign_type.ts
export interface Asset {
  fileName: string;
  fileUrl: string;
  assetType: "Page Link" | "video" | "brand_guidelines" | string;
  category: "brand" | "content" | string;
  fileSize?: number; // in bytes
  mimeType?: string;
  description?: string;
}

export interface StepFivePayload {
  needSampleProduct: boolean;
  assets: Asset[];
}

export interface Budget {
  baseBudget: string;
  vatAmount: string;
  totalBudget: string;
  netPayableAmount: string;
}

export interface StepFiveSummary {
  campaignName: string;
  campaignType: string;
  productType: string;
  campaignNiche: string;
  startingDate: string;
  duration: number;
  budget: Budget;
  milestonesCount: number;
  assetsCount: number;
  needSampleProduct: boolean;
}

export interface StepFiveResponse {
  success: boolean;
  message: string;
  data: {
    summary: StepFiveSummary;
  };
}
