import WorkInProgressCard from "./work-in-progress-card";
import UpcomingDeadline from "./upcoming-deadlines";
import ActionRequiredCard from "./action-required-card";
import { getActiveCampaigns } from "@/service/client/campaigns/active-campaigns";
import {
  getActionRequired,
  getUpcomingDeadlines,
} from "@/service/client/dashboard";

export default async function DashboardMainGrid() {
  const [campaigns, actionRequiredItems, upcomingDeadlines] = await Promise.all([
    getActiveCampaigns(),
    getActionRequired(),
    getUpcomingDeadlines(1, 5),
  ]);

  return (
    <div className="space-y-4 px-4 pt-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
        <div className="space-y-4 lg:col-span-4">
          <WorkInProgressCard data={campaigns} />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <ActionRequiredCard data={actionRequiredItems} />
          <UpcomingDeadline initialResponse={upcomingDeadlines} />
        </div>
      </div>
    </div>
  );
}