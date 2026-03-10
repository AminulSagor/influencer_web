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
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Dot } from "recharts";
import { DashboardProfitOverviewItem } from "@/types/admin/dashboard/dashboard_profit_overview_type";

type Props = {
  profitOverviewData: DashboardProfitOverviewItem[];
};

const chartConfig = {
  profit: {
    label: "Profit",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const formatYAxis = (value: number) => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return `${value}`;
};

const formatTooltipValue = (value: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(value);
};

const EarningOverviewCard = ({ profitOverviewData }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-[#2D5016]">Profit Overview</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <LineChart
            accessibilityLayer
            data={profitOverviewData}
            margin={{
              right: 20,
              top: 20,
              left: 12,
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
              tick={{ fill: "#2D5016", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#2D5016" }}
            />

            <YAxis
              dataKey="profit"
              stroke="#2D5016"
              tick={{ fill: "#2D5016", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#2D5016" }}
              tickFormatter={formatYAxis}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => formatTooltipValue(Number(value))}
                />
              }
            />

            <Line
              dataKey="profit"
              type="natural"
              stroke="#2D5016"
              strokeWidth={2}
              dot={<Dot fill="#2D5016" r={5} />}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="justify-center text-sm font-medium text-[#2D5016]">
        Profit Overview - Lifetime
      </CardFooter>
    </Card>
  );
};

export default EarningOverviewCard;