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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Dot } from "recharts";

const chartData = [
  { date: "7/11", earning: 20 },
  { date: "8/11", earning: 50 },
  { date: "9/11", earning: 10 },
  { date: "10/11", earning: 8 },
  { date: "12/11", earning: 50 },
  { date: "13/11", earning: 80 },
];

export const description = "A line chart";
const chartConfig = {
  earning: {
    label: "Earning",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const EarningOverviewCard = () => {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-[#2D5016]">Earning Overview</CardTitle>
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
        Earning in Thousands
      </CardFooter>
    </Card>
  );
};

export default EarningOverviewCard;
