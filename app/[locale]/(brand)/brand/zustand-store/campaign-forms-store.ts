import { create } from "zustand";

// ===== Step 2 types =====
export interface StepTwoData {
  productType: string;
  campaignNiche: string;
  preferredInfluencerIds: string[];
  notPreferableInfluencerIds: string[];
}

// Step 1
interface StepOneData {
  campaignName: string;
  campaignType: "paid-ad" | "influencer";
}

// Step 3
export interface StepThreeData {
  campaignGoals: string;
  productDetails: string;
  dos: string;
  donts: string;
  reportingRequirements: string;
  usageRights: string;
  startingDate: string;
  duration: string;
}

// Step 4
interface PromotionTarget {
  title: string;
  amount: string;
}

interface MilestoneData {
  id: number;
  title: string;
  subtitle: string;
  day: string;
  platform: string;
  promotionTarget: PromotionTarget;
  promotionGoal: string;
}

interface StepFourData {
  budget: number;
  vatAmount: number;
  totalWithVAT: number;
  agencyFeeMin: number;
  agencyFeeMax: number;
  campaignBudgetMin: number;
  campaignBudgetMax: number;
  milestones: MilestoneData[];
}

// Step 5
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface StepFiveData {
  contentAssets: UploadedFile[];
  brandAssets: UploadedFile[];
}

// ===== Full Store Interface =====
interface FormStore {
  stepOne: StepOneData;
  setStepOne: (data: Partial<StepOneData>) => void;

  stepTwo: StepTwoData;
  setStepTwo: (data: Partial<StepTwoData>) => void;

  stepThree: StepThreeData;
  setStepThree: (data: Partial<StepThreeData>) => void;

  stepFour: StepFourData;
  setStepFour: (data: Partial<StepFourData>) => void;
  addMilestone: (milestone: MilestoneData) => void;
  removeMilestone: (id: number) => void;
  clearMilestones: () => void;

  validationErrors: Record<string, string | undefined>;
  setValidationErrors: (errors: Record<string, string | undefined>) => void;
  clearValidationErrors: () => void;

  stepFive: StepFiveData;
  addContentAsset: (file: File) => void;
  addBrandAsset: (file: File) => void;
  removeContentAsset: (id: string) => void;
  removeBrandAsset: (id: string) => void;
  clearContentAssets: () => void;
  clearBrandAssets: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  // Step 1
  stepOne: {
    campaignName: "",
    campaignType: "paid-ad",
  },
  setStepOne: (data) =>
    set((state) => ({ stepOne: { ...state.stepOne, ...data } })),

  // Step 2
  stepTwo: {
    productType: "",
    campaignNiche: "",
    preferredInfluencerIds: [],
    notPreferableInfluencerIds: [],
  },
  setStepTwo: (data: Partial<StepTwoData>) =>
    set((state) => ({ stepTwo: { ...state.stepTwo, ...data } })),

  // Step 3
  stepThree: {
    campaignGoals: "",
    productDetails: "",
    dos: "",
    donts: "",
    reportingRequirements: "",
    usageRights: "",
    startingDate: "",
    duration: "",
  },
  setStepThree: (data) =>
    set((state) => ({ stepThree: { ...state.stepThree, ...data } })),

  // Step 4
  stepFour: {
    budget: 0,
    vatAmount: 0,
    totalWithVAT: 0,
    agencyFeeMin: 0,
    agencyFeeMax: 0,
    campaignBudgetMin: 0,
    campaignBudgetMax: 0,
    milestones: [],
  },
  setStepFour: (data) =>
    set((state) => ({ stepFour: { ...state.stepFour, ...data } })),
  addMilestone: (milestone) =>
    set((state) => ({
      stepFour: {
        ...state.stepFour,
        milestones: [...state.stepFour.milestones, milestone],
      },
    })),
  removeMilestone: (id: number) =>
    set((state) => ({
      stepFour: {
        ...state.stepFour,
        milestones: state.stepFour.milestones.filter((m) => m.id !== id),
      },
    })),
  clearMilestones: () =>
    set((state) => ({ stepFour: { ...state.stepFour, milestones: [] } })),

  validationErrors: {},
  setValidationErrors: (errors) => set(() => ({ validationErrors: errors })),
  clearValidationErrors: () => set(() => ({ validationErrors: {} })),

  // Step 5
  stepFive: { contentAssets: [], brandAssets: [] },
  addContentAsset: (file) =>
    set((state) => {
      const newFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      };
      return {
        stepFive: {
          ...state.stepFive,
          contentAssets: [...state.stepFive.contentAssets, newFile],
        },
      };
    }),
  addBrandAsset: (file) =>
    set((state) => {
      const newFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      };
      return {
        stepFive: {
          ...state.stepFive,
          brandAssets: [...state.stepFive.brandAssets, newFile],
        },
      };
    }),
  removeContentAsset: (id: string) =>
    set((state) => ({
      stepFive: {
        ...state.stepFive,
        contentAssets: state.stepFive.contentAssets.filter((f) => f.id !== id),
      },
    })),
  removeBrandAsset: (id: string) =>
    set((state) => ({
      stepFive: {
        ...state.stepFive,
        brandAssets: state.stepFive.brandAssets.filter((f) => f.id !== id),
      },
    })),
  clearContentAssets: () =>
    set((state) => ({ stepFive: { ...state.stepFive, contentAssets: [] } })),
  clearBrandAssets: () =>
    set((state) => ({ stepFive: { ...state.stepFive, brandAssets: [] } })),
}));
