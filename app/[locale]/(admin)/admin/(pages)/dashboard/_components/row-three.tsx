import React from "react";
import EarningOverviewCard from "./earning-overview-card";
import CampaignAcceptOrDeclinedCard from "./campaign-accept-declined-card";
import { DashboardChartStatsResponse } from "@/types/admin/dashboard/dashboard_charts_stats_type";
import { DashboardProfitOverviewItem } from "@/types/admin/dashboard/dashboard_profit_overview_type";

type Props = {
  initialChartStats: DashboardChartStatsResponse;
  profitOverviewData: DashboardProfitOverviewItem[];
};

const RowThree = ({ initialChartStats, profitOverviewData }: Props) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-8">
        <EarningOverviewCard profitOverviewData={profitOverviewData} />
      </div>
      <div className="col-span-12 md:col-span-4">
        <CampaignAcceptOrDeclinedCard initialChartStats={initialChartStats} />
      </div>
    </div>
  );
};

export default RowThree;