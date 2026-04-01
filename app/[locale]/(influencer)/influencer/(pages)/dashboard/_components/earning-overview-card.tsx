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
import { useEffect, useState, useCallback } from "react";
import { getEarningsOverview } from "@/service/influencer/dashboard/earnings_overview";
import { EarningsBreakdownItem, EarningsOverviewRange } from "@/types/influencer/dashboard/earnings_overview";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const chartConfig = {
  earning: {
    label: "Earning",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const EarningOverviewCard = () => {
  const t = useTranslations("influencer.dashboard.earningOverviewCard");
  const [chartData, setChartData] = useState<{ date: string; earning: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getEarningsOverview("7d");
      const mapped = data.breakdown.map((item: EarningsBreakdownItem) => ({
        date: new Date(item.date).toLocaleDateString("en-US", { month: "numeric", day: "numeric" }),
        earning: item.amount,
      }));
      setChartData(mapped);
    } catch (err) {
      setError("Failed to load earnings overview.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-[#2D5016]">{t("title")}</CardTitle></CardHeader>
        <CardContent className="space-y-3 py-6">
          <div className="flex items-end gap-4 px-4">
            <Skeleton className="h-24 w-8" />
            <Skeleton className="h-32 w-8" />
            <Skeleton className="h-16 w-8" />
            <Skeleton className="h-28 w-8" />
            <Skeleton className="h-20 w-8" />
            <Skeleton className="h-36 w-8" />
            <Skeleton className="h-12 w-8" />
          </div>
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-[#2D5016]">{t("title")}</CardTitle></CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-2">
          <p className="text-sm text-red-500">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchData}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-[#2D5016]">{t("title")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              right: 20,
              top: 20,
            }}
          >
            {/* Custom Cartesian Grid */}
            <CartesianGrid
              stroke="#dedede" // Light gray grid lines
              strokeDasharray="6 6" // Dashed grid lines
              vertical={true} // Disable vertical lines
              horizontal={true} // Enable horizontal grid lines
            />
            <XAxis
              dataKey="date"
              stroke="#2D5016" // Change the axis line color
              tick={{ fill: "#2D5016" }} // Change the color of the tick labels (data)
              tickLine={false} // Optional: To remove the tick lines (vertical lines from the axis)
              axisLine={{ stroke: "#2D5016" }} // Optional: If you want to customize the axis line itself
            />
            <YAxis
              dataKey="earning"
              stroke="#2D5016" // Change the axis line color
              tick={{ fill: "#2D5016" }} // Change the color of the tick labels (data)
              tickLine={false} // Optional: To remove the tick lines (horizontal lines from the axis)
              axisLine={{ stroke: "#2D5016" }} // Optional: If you want to customize the axis line itself
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
      <CardFooter className="justify-center text-[#2D5016] text-sm font-medium ">
        {t("footer")}
      </CardFooter>
    </Card>
  );
};

export default EarningOverviewCard;
