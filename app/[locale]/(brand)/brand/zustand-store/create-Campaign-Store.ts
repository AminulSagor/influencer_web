import { campaignStoreType } from "@/types/client/campaigns/create-campaign-types";
import { create } from "zustand";

export const useCampaignStore = create<campaignStoreType>((set) => ({
  step: 1,
  campaignType: "paid_ad",
  campaignId: "",
  open: false,

  setStep: (step) => set({ step: Math.max(1, step) }),

  increaseStep: () =>
    set((state) => ({
      step: state.step + 1,
    })),

  decreaseStep: () =>
    set((state) => ({
      step: Math.max(1, state.step - 1),
    })),

  toggleOpen: () =>
    set((state) => ({
      open: !state.open,
    })),

  setCampaignId: (id) => set({ campaignId: id }),
  setCampaignType: (t) => set({ campaignType: t }),

  resetCampaignStore: () =>
    set({
      step: 1,
      campaignType: "paid_ad",
      campaignId: "",
      open: false,
    }),
}));
