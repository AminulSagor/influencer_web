import DashboardStatsCards from "./_components/dashboard-stats-cards";
import DashboardMainGrid from "./_components/dashboard-main-grid";
import LifetimeSummary from "./_components/lifetime-summary";

import {
  getActiveJobsTotal,
  getLifetimeSummary,
  getPendingCampaigns,
} from "@/service/client/dashboard";

export default async function Page() {
  const [activeJobsTotal, lifetimeSummary, pendingCampaignsRes] =
    await Promise.all([
      getActiveJobsTotal(),
      getLifetimeSummary(),
      getPendingCampaigns(),
    ]);

  return (
    <div className="pb-20">
      <DashboardStatsCards
        activeJobsTotal={activeJobsTotal}
        pendingCampaings={pendingCampaignsRes.data}
        pendingCampaignsError={pendingCampaignsRes.error}
      />

      <DashboardMainGrid />

      <div className="pt-6 px-4">
        <LifetimeSummary data={lifetimeSummary} />
      </div>
    </div>
  );
}