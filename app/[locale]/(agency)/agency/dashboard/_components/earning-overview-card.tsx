"use client";

import { useEffect, useMemo, useState } from "react";
import type { TooltipProps } from "recharts";
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

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
} from "@/components/ui/chart";
import { getEarningOverview } from "@/service/agency/earning-overview";
import type {
  EarningBreakdownItem,
  EarningOverviewData,
  EarningRange,
} from "@/types/agency/earning-overview";

type ChartPoint = {
  date: string;
  fullDate: string;
  earning: number;
  rawAmount: number;
  paymentCount: number;
};

const chartConfig = {
  earning: {
    label: "Earning",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const defaultOverview: EarningOverviewData = {
  totalEarnings: 0,
  completedJobs: 0,
  currency: "BDT",
  timeRange: "7d",
  breakdown: [],
};

const rangeOptions: { label: string; value: EarningRange }[] = [
  { label: "7 Days", value: "7d" },
  { label: "15 Days", value: "15d" },
  { label: "30 Days", value: "30d" },
];

const parseDateOnly = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatAxisDate = (date: Date) => {
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const formatCurrency = (amount: number, currency: string) => {
  if (currency === "BDT") {
    return `৳ ${amount.toLocaleString("en-BD")}`;
  }

  return `${currency} ${amount.toLocaleString("en-US")}`;
};

const formatThousands = (amount: number) => {
  return Number((amount / 1000).toFixed(1));
};

const getRangeDays = (range: EarningRange) => {
  if (range === "15d") return 15;
  if (range === "30d") return 30;
  return 7;
};

const getLatestBreakdownDate = (breakdown: EarningBreakdownItem[]) => {
  if (breakdown.length === 0) {
    return new Date();
  }

  return breakdown.reduce((latest, item) => {
    const current = parseDateOnly(item.date);
    return current > latest ? current : latest;
  }, parseDateOnly(breakdown[0].date));
};

const buildChartData = (
  breakdown: EarningBreakdownItem[],
  range: EarningRange
): ChartPoint[] => {
  const totalDays = getRangeDays(range);
  const endDate = getLatestBreakdownDate(breakdown);

  const amountMap = new Map(
    breakdown.map((item) => [
      item.date,
      { amount: item.amount, paymentCount: item.paymentCount },
    ])
  );

  const points: ChartPoint[] = [];

  for (let index = totalDays - 1; index >= 0; index -= 1) {
    const currentDate = new Date(endDate);
    currentDate.setDate(endDate.getDate() - index);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const key = `${year}-${month}-${day}`;

    const matched = amountMap.get(key);
    const rawAmount = matched?.amount ?? 0;
    const paymentCount = matched?.paymentCount ?? 0;

    points.push({
      date: formatAxisDate(currentDate),
      fullDate: key,
      earning: formatThousands(rawAmount),
      rawAmount,
      paymentCount,
    });
  }

  return points;
};

function EarningTooltip({
  active,
  payload,
  currency,
}: TooltipProps<number, string> & { currency: string }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0]?.payload as ChartPoint | undefined;

  if (!point) {
    return null;
  }

  return (
    <div className="rounded-md border bg-white px-3 py-2 shadow-sm">
      <div className="flex items-center gap-2 text-xs text-[#2D5016]">
        <span className="h-2 w-2 rounded-sm bg-[#2D5016]" />
        <span>Earning</span>
        <span className="font-semibold">
          {formatCurrency(point.rawAmount, currency)}
        </span>
      </div>
    </div>
  );
}

const EarningOverviewCard = () => {
  const [range, setRange] = useState<EarningRange>("7d");
  const [overview, setOverview] = useState<EarningOverviewData>(defaultOverview);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarningOverview = async () => {
      try {
        setIsLoading(true);
        const response = await getEarningOverview(range);

        if (response.success) {
          setOverview(response.data);
        }
      } catch (error) {
        console.error("Failed to load earning overview:", error);
        setOverview(defaultOverview);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarningOverview();
  }, [range]);

  const chartData = useMemo(() => {
    return buildChartData(overview.breakdown, range);
  }, [overview.breakdown, range]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-[#2D5016]">Earning Overview</CardTitle>

          <select
            value={range}
            onChange={(event) => setRange(event.target.value as EarningRange)}
            className="h-8 rounded-full border border-[#D9D9D9] bg-white px-3 text-xs text-[#2D5016] outline-none"
          >
            {rangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-[340px] items-center justify-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[340px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                right: 20,
                top: 20,
              }}
            >
              <CartesianGrid
                stroke="#dedede"
                strokeDasharray="6 6"
                vertical
                horizontal
              />

              <XAxis
                dataKey="date"
                stroke="#2D5016"
                tick={{ fill: "#2D5016" }}
                tickLine={false}
                axisLine={{ stroke: "#2D5016" }}
              />

              <YAxis
                stroke="#2D5016"
                tick={{ fill: "#2D5016" }}
                tickLine={false}
                axisLine={{ stroke: "#2D5016" }}
              />

              <ChartTooltip
                cursor={false}
                content={<EarningTooltip currency={overview.currency} />}
              />

              <Line
                dataKey="earning"
                type="natural"
                stroke="#2D5016"
                strokeWidth={2}
                dot={<Dot fill="#2D5016" r={5} />}
                activeDot={{ r: 6, fill: "#2D5016" }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="justify-center text-[#2D5016] text-sm font-medium">
        Earning in Thousands
      </CardFooter>
    </Card>
  );
};

export default EarningOverviewCard;