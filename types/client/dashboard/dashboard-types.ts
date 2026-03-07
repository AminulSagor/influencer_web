import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

export type ActiveJobsResponse = {
  jobs: unknown[];
};

export type LifetimeSummaryData = {
  totalCompleted: number;
  totalDeclined: number;
  topInfluencer: {
    name: string;
    totalEarned: number;
    logo: string;
    totalJobsCompleted: number;
    lastCompletedJobId: string;
    lastCompletedJobName: string;
    lastCompletedJobDate: string;
  };
};

export type StatsCard = {
  title: string;
  value: string;
  icon: LucideIcon | IconType;
  link?: string;
};
