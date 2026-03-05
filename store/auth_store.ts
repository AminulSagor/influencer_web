import { create } from "zustand";

export type UserRole = "client" | "influencer" | "agency";

type AuthState = {
  token: string | null;
  userType: UserRole | null;
  phone: string | null;
  email: string | null;
  isVerified: boolean;
  setToken: (token: string | null) => void;
   setUserType: (userType: UserRole | null) => void; 

  setAuth: (data: {
    token: string;
    role?: UserRole;
    phone?: string;
    email?: string;
    isVerified?: boolean;
  }) => void;

  setPhone: (phone: string) => void;

  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userType: null,
  phone: null,
  email: null,
  isVerified: false,

  setAuth: ({ token, role, phone, email, isVerified }) =>
    set({
      token,
      userType: role ?? null,
      phone: phone ?? null,
      email: email ?? null,
      isVerified: isVerified ?? false,
    }),

  setPhone: (phone) =>
    set({
      phone,
    }),

    setToken: (token) =>
    set({
      token,
    }),

    setUserType: (userType) =>
    set({
      userType,
    }),

  clearAuth: () =>
    set({
      token: null,
      userType: null,
      phone: null,
      email: null,
      isVerified: false,
    }),


}));
