import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ForgotPasswordState = {
  identifier: string;
  setIdentifier: (identifier: string) => void;
  
  otp: string[]; // Store as array for UI, but we'll join it when sending
  setOtp: (otp: string[]) => void;
  setOtpDigit: (index: number, digit: string) => void;
  clearOtp: () => void;
  
  clearAll: () => void;
};

export const useForgotPasswordStore = create<ForgotPasswordState>()(
  persist(
    (set) => ({
      identifier: "",
      setIdentifier: (identifier) => set({ identifier }),
      
      otp: ["", "", "", ""],
      setOtp: (otp) => set({ otp }),
      setOtpDigit: (index, digit) => 
        set((state) => {
          const newOtp = [...state.otp];
          newOtp[index] = digit;
          return { otp: newOtp };
        }),
      clearOtp: () => set({ otp: ["", "", "", ""] }),
      
      clearAll: () => set({
        identifier: "",
        otp: ["", "", "", ""],
      }),
    }),
    {
      name: 'forgot-password-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);