import { create } from "zustand";

type MilestoneUIState = {
  selectedId: string | null;
  isDetailsOpen: boolean;

  select: (id: string) => void;
  toggleFor: (id: string) => void;
  close: () => void;
  clear: () => void;
};

export const useMilestoneUIStore = create<MilestoneUIState>((set, get) => ({
  selectedId: null,
  isDetailsOpen: false,

  select: (id) => set({ selectedId: id, isDetailsOpen: true }),

  toggleFor: (id) => {
    const { selectedId, isDetailsOpen } = get();
    if (selectedId === id) {
      set({ isDetailsOpen: !isDetailsOpen });
      return;
    }
    set({ selectedId: id, isDetailsOpen: true });
  },

  close: () => set({ isDetailsOpen: false }),

  clear: () => set({ selectedId: null, isDetailsOpen: false }),
}));
