import { create } from "zustand";
import { persist } from "zustand/middleware";

type ForgotPasswordState = {
  identifier: string;
  setIdentifier: (identifier: string) => void;
  
  otp: string[];
  setOtp: (otp: string[]) => void;
  setOtpDigit: (index: number, digit: string) => void;
  clearOtp: () => void;
  
  newPassword: string;
  confirmPassword: string;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  
  resetToken: string | null;
  setResetToken: (token: string | null) => void;
  
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
      
      newPassword: "",
      confirmPassword: "",
      setNewPassword: (newPassword) => set({ newPassword }),
      setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
      
      resetToken: null,
      setResetToken: (resetToken) => set({ resetToken }),
      
      clearAll: () => set({
        identifier: "",
        otp: ["", "", "", ""],
        newPassword: "",
        confirmPassword: "",
        resetToken: null,
      }),
    }),
    {
      name: 'forgot-password-storage',
    }
  )
);