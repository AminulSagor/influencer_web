import { create } from "zustand";

export type UserType = "brand" | "influencer" | "agency" | null;

type SignUpStepTwoData = {
  brandName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
};

type AuthStore = {
  userType: UserType;
  setUserType: (type: UserType) => void;

  stepTwoData: SignUpStepTwoData;
  setStepTwoData: (data: Partial<SignUpStepTwoData>) => void;
  resetStepTwoData: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  userType: null,
  setUserType: (type) => set({ userType: type }),

  stepTwoData: {},
  setStepTwoData: (data) =>
    set((state) => ({ stepTwoData: { ...state.stepTwoData, ...data } })),
  resetStepTwoData: () => set({ stepTwoData: {} }),
}));
