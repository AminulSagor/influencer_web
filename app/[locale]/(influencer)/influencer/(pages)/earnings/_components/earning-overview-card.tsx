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

const chartData = [
  { date: "7/11", earning: 20 },
  { date: "8/11", earning: 50 },
  { date: "9/11", earning: 10 },
  { date: "10/11", earning: 8 },
  { date: "12/11", earning: 50 },
  { date: "13/11", earning: 80 },
];

const chartConfig = {
  earning: {
    label: "Earning",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const EarningOverviewCard = () => {
  const t = useTranslations("influencer.dashboard.earningOverviewCard");

  return (
    <Card className="">
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-[#2D5016]">{t("title")}</CardTitle>
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
