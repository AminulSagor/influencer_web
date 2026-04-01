import { create } from "zustand";

export type MilestoneOverrideStatus = "completed_plus_plus";

type MilestonePerformanceState = {
  averagePerformance: number;
  hasTargetMetrics: boolean;
};

type MilestoneStatusStore = {
  overrides: Record<string, MilestoneOverrideStatus>;
  performance: Record<string, MilestonePerformanceState>;

  syncMilestonePerformance: (params: {
    milestoneId: string;
    averagePerformance: number;
    hasTargetMetrics: boolean;
    fallbackStatus?: string | null;
  }) => void;

  removeMilestoneOverride: (milestoneId: string) => void;
  clearMilestoneOverrides: () => void;

  getResolvedMilestoneStatus: (
    milestoneId: string,
    fallbackStatus?: string | null,
  ) => string;

  getMilestonePerformance: (milestoneId: string) => MilestonePerformanceState;
};

function normalizeStatus(value?: string | null) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function canBeCompletedPlusPlus(status?: string | null) {
  const normalized = normalizeStatus(status);
  return normalized === "completed" || normalized === "completed_plus_plus";
}

export const useMilestoneStatusStore = create<MilestoneStatusStore>(
  (set, get) => ({
    overrides: {},
    performance: {},

    syncMilestonePerformance: ({
      milestoneId,
      averagePerformance,
      hasTargetMetrics,
      fallbackStatus,
    }) => {
      if (!milestoneId) return;

      set((state) => {
        const nextOverrides = { ...state.overrides };
        const nextPerformance = {
          ...state.performance,
          [milestoneId]: {
            averagePerformance,
            hasTargetMetrics,
          },
        };

        if (
          canBeCompletedPlusPlus(fallbackStatus) &&
          hasTargetMetrics &&
          averagePerformance > 100
        ) {
          nextOverrides[milestoneId] = "completed_plus_plus";
        } else {
          delete nextOverrides[milestoneId];
        }

        return {
          overrides: nextOverrides,
          performance: nextPerformance,
        };
      });
    },
    removeMilestoneOverride: (milestoneId) => {
      set((state) => {
        const nextOverrides = { ...state.overrides };
        delete nextOverrides[milestoneId];

        return {
          overrides: nextOverrides,
        };
      });
    },

    clearMilestoneOverrides: () => {
      set({
        overrides: {},
      });
    },

    getResolvedMilestoneStatus: (milestoneId, fallbackStatus) => {
      return (
        get().overrides[milestoneId] ?? String(fallbackStatus ?? "pending")
      );
    },

    getMilestonePerformance: (milestoneId) => {
      return (
        get().performance[milestoneId] ?? {
          averagePerformance: 0,
          hasTargetMetrics: false,
        }
      );
    },
  }),
);
