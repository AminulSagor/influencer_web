import { create } from "zustand";

//step1
interface StepOneData {
  campaignName: string;
  campaignType: "paid-ad" | "influencer";
}

//step2
interface StepTwoData {
  nicheType: string;
}

//step3
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

//step 4 types
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

//Step 5 interfaces
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

//====== zustand type ===========//
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
  validationErrors: Record<string, string>;
  setValidationErrors: (errors: Record<string, string>) => void;
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
  //stepOne
  stepOne: {
    campaignName: "",
    campaignType: "paid-ad",
  },
  setStepOne: (data) =>
    set((state) => ({
      stepOne: { ...state.stepOne, ...data },
    })),

  //stpeTwo
  stepTwo: {
    nicheType: "",
  },
  setStepTwo: (data) =>
    set((state) => ({
      stepTwo: { ...state.stepTwo, ...data },
    })),

  //stepThree
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
    set((state) => ({
      stepThree: { ...state.stepThree, ...data },
    })),

  //stepFour
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
    set((state) => ({
      stepFour: { ...state.stepFour, ...data },
    })),
  addMilestone: (milestone) =>
    set((state) => ({
      stepFour: {
        ...state.stepFour,
        milestones: [...state.stepFour.milestones, milestone],
      },
    })),
  removeMilestone: (id) =>
    set((state) => ({
      stepFour: {
        ...state.stepFour,
        milestones: state.stepFour.milestones.filter((m) => m.id !== id),
      },
    })),
  clearMilestones: () =>
    set((state) => ({
      stepFour: {
        ...state.stepFour,
        milestones: [],
      },
    })),

  validationErrors: {},
  setValidationErrors: (errors) =>
    set(() => ({
      validationErrors: errors,
    })),
  clearValidationErrors: () =>
    set(() => ({
      validationErrors: {},
    })),

  //step Five
  stepFive: {
    contentAssets: [],
    brandAssets: [],
  },
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
  removeContentAsset: (id) =>
    set((state) => ({
      stepFive: {
        ...state.stepFive,
        contentAssets: state.stepFive.contentAssets.filter(
          (asset) => asset.id !== id
        ),
      },
    })),
  removeBrandAsset: (id) =>
    set((state) => ({
      stepFive: {
        ...state.stepFive,
        brandAssets: state.stepFive.brandAssets.filter(
          (asset) => asset.id !== id
        ),
      },
    })),
  clearContentAssets: () =>
    set((state) => ({
      stepFive: {
        ...state.stepFive,
        contentAssets: [],
      },
    })),
  clearBrandAssets: () =>
    set((state) => ({
      stepFive: {
        ...state.stepFive,
        brandAssets: [],
      },
    })),
}));
