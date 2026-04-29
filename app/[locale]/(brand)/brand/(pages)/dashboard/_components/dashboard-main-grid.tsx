// app/dashboard/_components/dashboard-main-grid.tsx
"use client";

import WorkInProgressCard from "./work-in-progress-card";
import UpcomingDeadline from "./upcoming-deadlines";
import ActionRequiredCard from "./action-required-card";
import { Campaign } from "@/types/client/campaigns/campaign";
import {
  ActionRequiredItem,
  UpcomingDeadlineItem,
} from "@/types/client/dashboard/dashboard-types";
import { PaginationMeta, ServiceResponse } from "@/types/service-response";

interface DashboardMainGridProps {
  campaigns: Campaign[];
  actionRequiredItems: ActionRequiredItem[];
  upcomingDeadlines: ServiceResponse<UpcomingDeadlineItem[], PaginationMeta>;
}

export default function DashboardMainGrid({
  campaigns,
  actionRequiredItems,
  upcomingDeadlines,
}: DashboardMainGridProps) {
  return (
    <div className="space-y-4 px-4 pt-6">
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-6">
        <div className="flex lg:col-span-4">
          <WorkInProgressCard data={campaigns} />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2 lg:h-full">
          <ActionRequiredCard data={actionRequiredItems} />
          <UpcomingDeadline initialResponse={upcomingDeadlines} />
        </div>
      </div>
    </div>
  );
}
