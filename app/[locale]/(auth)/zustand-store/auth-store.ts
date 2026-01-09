import { UserType } from "@/types/auth-types";
import { create } from "zustand";

type AuthStore = {
  userType: UserType;
  phone: string;
  setUserType: (type: UserType) => void;
  setPhone: (phone: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  userType: null,
  phone: "",

  setUserType: (type) => set({ userType: type }),
  setPhone: (phone) => set({ phone }),

  clearAuth: () => set({ userType: null, phone: "" }),
}));
