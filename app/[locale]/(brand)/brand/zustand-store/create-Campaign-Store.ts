import { create } from "zustand";

type campaignStoreType = {
  step: number;
  increaseStep: () => void;
  decreaseStep: () => void;
  open: boolean;
  toggleOpen: () => void;

  // create campaign data agency
};
export const useCampaignStore = create<campaignStoreType>((set) => ({
  step: 6,
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
