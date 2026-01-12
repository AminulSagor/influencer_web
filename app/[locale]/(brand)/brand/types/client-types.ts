//create campaign z-store
export type CampaignType = "paid_ad" | "influencer_promotion";
export interface campaignStoreType {
  step: number;
  increaseStep: () => void;
  decreaseStep: () => void;
  open: boolean;
  toggleOpen: () => void;

  campaignType: CampaignType;
  campaignId: string;
  setCampaignId: (id: string) => void;
  setCampaignType: (t: "paid_ad" | "influencer_promotion") => void;
}
