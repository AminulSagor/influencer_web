import { create } from "zustand";

type campaignStoreType = {
  open: boolean;
  toggleOpen: () => void;
};
export const useCampaignStore = create<campaignStoreType>((set) => ({
  open: false,
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));
