import EarningOverviewCard from "./_components/earning-overview-card";
import ActionRequiredCard from "./_components/action-required-card";
import WorkInProgressCard from "./_components/work-in-progress-card";
import UpcomingDeadline from "./_components/upcoming-deadlines";
import NewJobOffers from "./_components/new-job-offers";
import DashboardSummaryCards from "./_components/dashboard-summary-cards";
import LifetimeSummaryCard from "./_components/lifetime-summary-card";

const page = () => {
  return (
    <div className="pb-20">
      <DashboardSummaryCards />

      <div className="pt-6 px-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
          <div className="space-y-4 lg:col-span-4">
            <EarningOverviewCard />
            <WorkInProgressCard />
          </div>

          <div className="space-y-4 lg:col-span-2">
            <ActionRequiredCard />
            <UpcomingDeadline />
            <NewJobOffers />
          </div>
        </div>

        <LifetimeSummaryCard />
      </div>
    </div>
  );
};

export default page;