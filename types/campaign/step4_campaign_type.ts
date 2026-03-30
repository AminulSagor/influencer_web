// types/campaign/step4_campaign_type.ts

export interface Milestone {
  contentTitle: string;
  platform: string;
  contentQuantity: string;
  deliveryDays: number;
  expectedViews?: number;
  expectedReach?: number;
  expectedLikes?: number;
  expectedComments?: number;
  promotionGoal?: string;
  expectedFollows?: number;
  order?: number;
}

export interface StepFourPayload {
  baseBudget: number;
  milestones: Milestone[];
}

export interface StepFourResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    currentStep: number;
    nextStep: number;
    budget: {
      baseBudget: number;
      vatAmount: number;
      totalBudget: number;
      netPayableAmount: number;
    };
    milestonesCount: number;
  };
}
