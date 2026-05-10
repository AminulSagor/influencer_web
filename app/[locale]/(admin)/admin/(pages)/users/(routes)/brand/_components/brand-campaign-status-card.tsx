"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getUserChartStats,
  UserChartDateRange,
} from "@/service/admin/users/get-user-chart-stats";

interface Props {
  userId: string;
}

type ChartItem = {
  label: string;
  value: number;
  color: string;
};

const dateRangeOptions: {
  label: string;
  value: UserChartDateRange;
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
  `brand-chart-gradient-${label.toLowerCase().replace(/\s+/g, "-")}`;

const BrandCampaignStatusCard = ({ userId }: Props) => {
  const [dateRange, setDateRange] = useState<UserChartDateRange>("today");
  const [loading, setLoading] = useState(true);
  const [positiveLabel, setPositiveLabel] = useState("Placed");
  const [negativeLabel, setNegativeLabel] = useState("Declined");
  const [chartData, setChartData] = useState<ChartItem[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);

        const res = await getUserChartStats(userId, dateRange);

        setPositiveLabel(res?.data?.positiveLabel ?? "Placed");
        setNegativeLabel(res?.data?.negativeLabel ?? "Declined");
        setChartData(
          (res?.data?.chartData ?? []).map((item) => ({
            label: item.label ?? "",
            value: Number(item.value ?? 0),
            color: item.color ?? "#81BA44",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch brand chart stats:", error);
        setChartData([]);
        setPositiveLabel("Placed");
        setNegativeLabel("Declined");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId, dateRange]);

  return (
    <Card className="h-full gap-0 overflow-hidden p-0">
      <div className="border-b-0">
        <div className="space-y-4 p-4">
          <CardTitle className="text-Primary">
            Campaigns - {positiveLabel} vs {negativeLabel}
          </CardTitle>

          <div className="flex items-center gap-2">
            <p className="text-sm text-Primary">
              Get a glimpse how brands are interacting
            </p>

            <Select
              value={dateRange}
              onValueChange={(value) => setDateRange(value as UserChartDateRange)}
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
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <defs>
                {chartData.map((entry) => (
                  <linearGradient
                    key={entry.label}
                    id={gradientIdFromLabel(entry.label)}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Bar dataKey="value" radius={[0, 0, 0, 0]} barSize={90}>
                {chartData.map((entry) => (
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
        {chartData.map((item) => (
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
    </Card>
  );
};

export default BrandCampaignStatusCard;
