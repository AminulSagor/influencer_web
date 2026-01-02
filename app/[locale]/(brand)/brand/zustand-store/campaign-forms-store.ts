import { create } from "zustand";

interface StepOneData {
  campaignName: string;
  campaignType : "paid-ad" | "influencer";
}



interface FormStore {
  stepOne: StepOneData;
  setStepOne: (data: StepOneData) => void;
}

export const useFormStore = create<FormStore>((set) => ({
  stepOne: { campaignName: "" , campaignType : 'paid-ad'},
  setStepOne: (data) =>
    set((state) => ({
      stepOne: { ...state.stepOne, ...data },
    })),
}));
