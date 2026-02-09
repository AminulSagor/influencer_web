import { UserRole } from "@/types/auth/role_type";
import { create } from "zustand";

type AuthStore = {
  userType: UserRole;
  phone: string;
  token: string | null;
  setUserType: (type: UserRole) => void;
  setPhone: (phone: string) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  userType: null,
  phone: "",
  token: null,
  setToken: (tokenFromAuth) => set({ token: tokenFromAuth }),
  setUserType: (type) => set({ userType: type }),
  setPhone: (phone) => set({ phone }),

  clearAuth: () => set({ userType: null, phone: "", token: null }),
}));
