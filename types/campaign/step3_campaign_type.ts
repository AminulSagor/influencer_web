// --- Step 3 Payload ---
export interface StepThreePayload {
  campaignGoals: string;
  productServiceDetails: string;
  reportingRequirements: string;
  usageRights: string;
  startingDate: string; // ISO string
  duration: number; // in days
  dos: string;
  donts: string;
}

// --- Step 3 Response ---
export interface StepThreeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    currentStep: number;
    nextStep: number;
  };
}