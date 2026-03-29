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

export type ActionRequiredItem  = {
  type: string;
  priority: "High" | "Medium" | "Low";
  title: string;
  description: string;
  actionLink: string;
};

export type UpcomingDeadlineItem = {
  id: string;
  campaignName: string;
  status: string;
  deadline: string;
  daysLeft: number;
};