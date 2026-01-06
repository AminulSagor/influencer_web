import { PieChart, Pie, Cell } from "recharts";

interface CircularProgressChartProps {
  percentage: number; // 0 to 100
  size?: number; // diameter of the chart in px, default 120
  strokeWidth?: number; // thickness of the ring, default 10
}

const CircularProgressChart = ({
  percentage,
  size = 120,
  strokeWidth = 10,
}: CircularProgressChartProps) => {
  const data = [
    { name: "completed", value: percentage },
    { name: "remaining", value: 100 - percentage },
  ];

  const COLORS = [
    "#7a9b57", // original color (base fill)
    "#B9CCA3", // lighter tint (about 70-80% white blend)
  ];

  return (
    <PieChart width={size} height={size}>
      <Pie
        data={data}
        innerRadius={(size - strokeWidth) / 2}
        outerRadius={size / 2}
        startAngle={90}
        endAngle={-270} // draw counterclockwise
        dataKey="value"
        stroke="none"
        cornerRadius={strokeWidth / 2}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      {/* Percentage text in center */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-lg font-semibold text-Primary"
      >
        {percentage}%
      </text>
    </PieChart>
  );
};

export default CircularProgressChart;
