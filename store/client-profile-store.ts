"use client";

import { create } from "zustand";
import { BrandProfile } from "@/types/client/profile/profile";
import { getProfile } from "@/service/client/profile/profile";

type ProfileStore = {
  profile: BrandProfile | null;
  isLoading: boolean;
  setProfile: (profile: BrandProfile | null) => void;
  fetchProfile: () => Promise<void>;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  isLoading: false,

  setProfile: (profile) => set({ profile }),

  fetchProfile: async () => {
    set({ isLoading: true });

    const result = await getProfile();

    if (typeof result === "string") {
      set({ profile: null, isLoading: false });
      return;
    }

    set({
      profile: result,
      isLoading: false,
    });
  },
}));