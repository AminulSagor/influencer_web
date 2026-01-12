//create campaign z-store types
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

//create campaign step 4 types
export interface NewMilestoneForm {
  title: string;
  subtitle: string;
  day: string;
  platform: string;
  promotionTarget: {
    title: string;
    amount: string;
  };
  promotionGoal: string;
}

export type ApiMilestone = {
  contentTitle: string;
  platform: string;
  contentQuantity: string;
  deliveryDays: number;
  expectedReach: number;
  expectedViews: number;
  expectedLikes: number;
  expectedComments: number;
};

//respone uplaoad file
export type SignedUrlResponse = {
  signedUrl: string;
  publicUrl: string;
  fileKey: string;
};

export type AssetCategory = "content" | "brand";

export type LocalAsset = {
  id: string;
  file: File;
  category: AssetCategory;
  description: string;
};
