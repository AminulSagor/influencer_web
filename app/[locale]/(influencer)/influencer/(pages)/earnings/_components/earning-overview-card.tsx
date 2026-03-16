"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Dot } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useState } from "react";
import { getEarningsOverview } from "@/service/influencer/dashboard/earnings_overview";
import { EarningsBreakdownItem } from "@/types/influencer/dashboard/earnings_overview";

const chartConfig = {
  earning: {
    label: "Earning",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Range = "7d" | "30d" | "90d" | "1y";

const rangeOptions: { value: Range; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
];

const EarningOverviewCard = () => {
  const t = useTranslations("influencer.dashboard.earningOverviewCard");
  const [chartData, setChartData] = useState<{ date: string; earning: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<Range>("7d");

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await getEarningsOverview(range);
      const mapped = data.breakdown.map((item: EarningsBreakdownItem) => ({
        date: new Date(item.date).toLocaleDateString("en-US", { month: "numeric", day: "numeric" }),
        earning: item.amount,
      }));
      setChartData(mapped);
    } catch (error) {
      console.error("Failed to fetch earnings overview:", error);
      setError("Failed to load earnings overview.");
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#2D5016]">{t("title")}</CardTitle>
          <div className="flex gap-1">
            {rangeOptions.map((opt) => (
              <Skeleton key={opt.value} className="h-7 w-10 rounded-md" />
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex-1 py-4">
          <div className="space-y-4">
            {/* Y-axis + chart area skeleton */}
            <div className="flex gap-2">
              <div className="flex flex-col justify-between py-1">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
              </div>
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            {/* X-axis labels skeleton */}
            <div className="flex justify-between px-10">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Skeleton className="h-4 w-40" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="">
        <CardHeader>
          <CardTitle className="text-[#2D5016]">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center py-10 gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 text-sm font-medium rounded-md bg-[#2D5016] text-white hover:bg-[#3a6b1c] transition-colors"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#2D5016]">{t("title")}</CardTitle>
        <div className="flex gap-1">
          {rangeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                range === opt.value
                  ? "bg-[#2D5016] text-white"
                  : "bg-[#F7FAEC] text-[#4B6B2A] hover:bg-[#E3EACD]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CardHeader>

      {/* Chart area (THIS is the key fix) */}
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full">
          <LineChart data={chartData} margin={{ right: 20, top: 20 }}>
            <CartesianGrid
              stroke="#dedede"
              strokeDasharray="6 6"
              vertical
              horizontal
            />

            <XAxis
              dataKey="date"
              tick={{ fill: "#2D5016" }}
              tickLine={false}
              axisLine={{ stroke: "#2D5016" }}
            />

            <YAxis
              tick={{ fill: "#2D5016" }}
              tickLine={false}
              axisLine={{ stroke: "#2D5016" }}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Line
              dataKey="earning"
              type="natural"
              stroke="#2D5016"
              strokeWidth={2}
              dot={<Dot fill="#2D5016" r={5} />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      {/* Footer */}
      <CardFooter className="justify-center text-[#2D5016] text-sm font-medium">
        {t("footer")}
      </CardFooter>
    </Card>
  );
};

export default EarningOverviewCard;
