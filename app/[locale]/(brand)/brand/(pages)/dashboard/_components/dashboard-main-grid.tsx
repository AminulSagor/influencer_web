"use client";

import WorkInProgressCard from "./work-in-progress-card";
import UpcomingDeadline from "./upcoming-deadlines";
import ActionRequiredCard from "./action-required-card";

export default function DashboardMainGrid() {
  return (
    <div className="pt-6 px-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
        <div className="space-y-4 lg:col-span-4">
          <WorkInProgressCard />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <ActionRequiredCard />
          <UpcomingDeadline />
        </div>
      </div>
    </div>
  );
}
