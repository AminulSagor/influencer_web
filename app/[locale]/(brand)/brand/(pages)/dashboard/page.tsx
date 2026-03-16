import DashboardStatsCards from "./_components/dashboard-stats-cards";
import DashboardMainGrid from "./_components/dashboard-main-grid";
import LifetimeSummary from "./_components/lifetime-summary";

import {
  getActiveJobsTotal,
  getLifetimeSummary,
} from "@/service/client/dashboard/index";

export default async function Page() {
  const [activeJobsTotal, lifetimeSummary] = await Promise.all([
    getActiveJobsTotal(),
    getLifetimeSummary(),
  ]);

  return (
    <div className="pb-20">
      <DashboardStatsCards activeJobsTotal={activeJobsTotal} />
      <DashboardMainGrid />
      <div className="pt-6 px-4">
        <LifetimeSummary data={lifetimeSummary} />
      </div>
    </div>
  );
}
