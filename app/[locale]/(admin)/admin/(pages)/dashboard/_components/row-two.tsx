import { DashboardActivityItem } from "@/types/admin/dashboard/dashboard_activity_type";
import ActionRequiredCard from "./action-required-card";
import QuickActionsCard from "./quick-actions-card";
import RecentActivityCard from "./recent-activity-card";

import {
  DashboardActionsResponse,
  DashboardActionTab,
} from "@/types/admin/dashboard/dashboard_actions_type";

type Props = {
  actionsData: DashboardActionsResponse;
  activityData: DashboardActivityItem[];
  actionFilters: {
    tab: DashboardActionTab;
    page: number;
    limit: number;
  };
};

const RowTwo = ({ actionsData, activityData, actionFilters }: Props) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8">
        <ActionRequiredCard
          actionsData={actionsData}
          filters={actionFilters}
        />
      </div>

      <div className="col-span-4">
        <div className="space-y-4">
          <QuickActionsCard />
          <RecentActivityCard activities={activityData} />
        </div>
      </div>
    </div>
  );
};

export default RowTwo;