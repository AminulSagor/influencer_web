import RowOne from "./_components/row-one";
import RowThree from "./_components/row-three";
import RowTwo from "./_components/row-two";

import { getDashboardSummaryCards } from "@/service/admin/dashboard/get-dashboard-summary-cards";
import { getDashboardActions } from "@/service/admin/dashboard/get-dashbaord-actions";
import { getDashboardActivity } from "@/service/admin/dashboard/get-dashbaord-activity";
import { getDashboardChartStatsServer } from "@/service/admin/dashboard/get-dashboard-chart-stats-server";
import { getDashboardProfitOverview } from "@/service/admin/dashboard/get-dashboard-profit-overview";

import { DashboardActionTab } from "@/types/admin/dashboard/dashboard_actions_type";

type PageProps = {
  searchParams?: Promise<{
    tab?: DashboardActionTab;
    page?: string;
    limit?: string;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const params = (await searchParams) ?? {};

  const tab: DashboardActionTab = params.tab ?? "all";
  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 10);

  const [
    summaryCardsRes,
    actionsRes,
    activityRes,
    chartStatsRes,
    profitOverviewRes,
  ] = await Promise.all([
    getDashboardSummaryCards(),
    getDashboardActions({ tab, page, limit }),
    getDashboardActivity(),
    getDashboardChartStatsServer({
      userType: "agency",
      dateRange: "today",
    }),
    getDashboardProfitOverview(),
  ]);

  return (
    <div className="p-4">
      <div className="space-y-4">
        <RowOne summaryData={summaryCardsRes.data} />
        <RowTwo
          actionsData={actionsRes}
          activityData={activityRes.data}
          actionFilters={{ tab, page, limit }}
        />
        <RowThree
          initialChartStats={chartStatsRes}
          profitOverviewData={profitOverviewRes.data}
        />
      </div>
    </div>
  );
};

export default Page;