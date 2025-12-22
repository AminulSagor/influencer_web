import EarningOverviewCard from "@/app/[locale]/(influencer)/influencer/(pages)/earnings/_components/earning-overview-card";
import RecentTransactionsCard from "@/app/[locale]/(influencer)/influencer/(pages)/earnings/_components/recent-transactions-card";
import StatCards from "@/app/[locale]/(influencer)/influencer/(pages)/earnings/_components/stat-cards";

const EarningPage = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-stretch">
        {/* Left */}
        <div className="h-full">
          <EarningOverviewCard />
        </div>

        {/* Right */}
        <div className="h-full flex flex-col">
          <StatCards />
        </div>
      </div>

      <div className="mt-6">
        <RecentTransactionsCard />
      </div>
    </div>
  );
};

export default EarningPage;
