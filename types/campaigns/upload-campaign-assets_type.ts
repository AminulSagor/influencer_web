export type CampaignAssetCategory = "brand" | "content" | string;

export interface UploadCampaignAssetItem {
  fileName: string;
  fileUrl: string;
  assetType: string;
  category: CampaignAssetCategory;
  fileSize?: number;
  mimeType?: string;
  description?: string;
}

export interface UploadCampaignAssetsPayload {
  assets: UploadCampaignAssetItem[];
}

export interface UploadCampaignAssetsResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
