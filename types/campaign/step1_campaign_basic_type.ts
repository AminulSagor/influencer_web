// types/campaign/step1_campaign_basic.ts
export type CampaignType = 
  | "paid_ad"           
  | "influencer_promotion"; 

export interface CampaignBasicPayload {
  campaignName: string;       
  campaignType: CampaignType;   
}        

export interface CampaignBasicResponse {
  success: boolean;
  message?: string;
  data: {
    id: string;             
    campaignName: string;
    currentStep: number;
    nextStep: number;
  };
}
