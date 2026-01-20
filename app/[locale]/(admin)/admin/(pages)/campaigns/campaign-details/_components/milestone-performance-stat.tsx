import { FaEye, FaComment, FaHeart, FaPlay } from "react-icons/fa";

type StatData = {
  label: string;
  icon: React.ReactNode;
  current: number;
  target: number;
};

const stats: StatData[] = [
  { label: "Reach", icon: <FaEye />, current: 200000, target: 300000 },
  { label: "Views", icon: <FaPlay />, current: 150000, target: 200000 },
  { label: "Comments", icon: <FaComment />, current: 5000, target: 10000 },
  { label: "Likes", icon: <FaHeart />, current: 120000, target: 150000 },
];

function StatCard({ label, icon, current, target }: StatData) {
  const percentage = Math.min(100, Math.round((current / target) * 100));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "k";
    return num.toString();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 font-semibold">
        <span>{icon}</span>
        <span>{label}</span>
      </div>

      <div className="px-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-light-green">
              {formatNumber(current)}
            </p>
            <p className="text-sm font-semibold text-orange">
              {formatNumber(target)}
            </p>
          </div>

          <div className="h-2 w-full bg-light-green/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-light-green rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="mt-2">
            <p className="text-orange">Target Hit {percentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MilestonePerformanceStats() {
  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
