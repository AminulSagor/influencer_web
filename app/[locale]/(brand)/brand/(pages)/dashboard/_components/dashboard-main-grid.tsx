import WorkInProgressCard from "./work-in-progress-card";
import UpcomingDeadline from "./upcoming-deadlines";
import ActionRequiredCard from "./action-required-card";
import { getActiveCampaigns } from "@/service/client/campaigns/active-campaigns";

export default async function DashboardMainGrid() {
  const campaigns = await getActiveCampaigns();

  return (
    <div className="pt-6 px-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
        <div className="space-y-4 lg:col-span-4">
          <WorkInProgressCard data={campaigns} />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <ActionRequiredCard />
          <UpcomingDeadline />
        </div>
      </div>
    </div>
  );
}