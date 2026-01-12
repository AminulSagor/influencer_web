import { campaignStoreType } from "@/app/[locale]/(brand)/brand/types/client-types";
import { create } from "zustand";

export const useCampaignStore = create<campaignStoreType>((set) => ({
  step: 4,
  campaignType: "paid_ad",
  campaignId: "",
  setCampaignType: (campaignType) => set({ campaignType }),
  setCampaignId: (id) => set({ campaignId: id }),
  increaseStep: () =>
    set((state) => ({
      step: state.step + 1,
    })),
  decreaseStep: () =>
    set((state) => ({
      step: state.step - 1,
    })),

  open: false,
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));
