"use client";

import React, { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

import {
  DashboardChartDateRange,
  DashboardChartStatsResponse,
  DashboardChartUserType,
} from "@/types/admin/dashboard/dashboard_charts_stats_type";
import { getDashboardChartStatsClient } from "@/service/admin/dashboard/get-dashboard-chart-stats";

type Props = {
  initialChartStats: DashboardChartStatsResponse;
};

const dateRangeOptions: {
  label: string;
  value: DashboardChartDateRange;
}[] = [
  { label: "Today", value: "today" },
  { label: "Last 3 Days", value: "last_3_days" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 15 Days", value: "last_15_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "Last 1 Year", value: "last_1_year" },
  { label: "Lifetime", value: "lifetime" },
];

const gradientIdFromLabel = (label: string) =>
  `chart-gradient-${label.toLowerCase().replace(/\s+/g, "-")}`;

const CampaignAcceptOrDeclinedCard = ({ initialChartStats }: Props) => {
  const [userType, setUserType] = useState<DashboardChartUserType>(
    initialChartStats.filter.userType
  );
  const [dateRange, setDateRange] = useState<DashboardChartDateRange>(
    initialChartStats.filter.dateRange
  );
  const [chartStats, setChartStats] =
    useState<DashboardChartStatsResponse>(initialChartStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChartStats = async () => {
      try {
        setLoading(true);

        const res = await getDashboardChartStatsClient({
          userType,
          dateRange,
        });

        setChartStats(res);
      } catch (error) {
        console.error("Failed to load chart stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (
      userType === initialChartStats.filter.userType &&
      dateRange === initialChartStats.filter.dateRange
    ) {
      return;
    }

    fetchChartStats();
  }, [
    userType,
    dateRange,
    initialChartStats.filter.userType,
    initialChartStats.filter.dateRange,
  ]);

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="border-b-0">
        <div className="space-y-4 p-4">
          <CardTitle className="text-Primary">
            Campaigns - Accepted vs Declined
          </CardTitle>

          <div className="flex items-center gap-2">
            <p className="text-sm text-Primary">
              Get a glimpse how influencers / agencies are interacting
            </p>

            <Select
              value={dateRange}
              onValueChange={(value) =>
                setDateRange(value as DashboardChartDateRange)
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select a timeframe" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-dark-gray">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartStats.data}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <defs>
                {chartStats.data.map((entry) => (
                  <linearGradient
                    key={entry.label}
                    id={gradientIdFromLabel(entry.label)}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={entry.color}
                      stopOpacity={0.85}
                    />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Bar dataKey="value" radius={[0, 0, 0, 0]} barSize={90}>
                {chartStats.data.map((entry) => (
                  <Cell
                    key={entry.label}
                    fill={`url(#${gradientIdFromLabel(entry.label)})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mb-4 flex justify-center gap-6">
        {chartStats.data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-medium text-Primary">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t p-4">
        <Tabs
          value={userType}
          onValueChange={(value) => setUserType(value as DashboardChartUserType)}
        >
          <TabsList className="w-full">
            <TabsTrigger
              className="data-[state=active]:bg-light-green data-[state=active]:text-white"
              value="agency"
            >
              Agencies
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-light-green data-[state=active]:text-white"
              value="influencer"
            >
              Influencers
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </Card>
  );
};

export default CampaignAcceptOrDeclinedCard;