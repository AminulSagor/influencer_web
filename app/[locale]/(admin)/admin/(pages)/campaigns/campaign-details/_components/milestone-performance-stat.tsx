import type { ReactNode } from "react";
import { FaComment, FaEye, FaHeart, FaPlay } from "react-icons/fa";

type StatCardProps = {
  label: string;
  icon: ReactNode;
  current: number;
  target: number;
};

type Props = {
  reach?: number;
  views?: number;
  comments?: number;
  likes?: number;
  targetReach?: number;
  targetViews?: number;
  targetComments?: number;
  targetLikes?: number;
};

function formatNumber(num: number) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
  return num.toString();
}

function StatCard({ label, icon, current, target }: StatCardProps) {
  const safeTarget = target > 0 ? target : 0;
  const percentage =
    safeTarget > 0 ? Math.min(100, Math.round((current / safeTarget) * 100)) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 font-semibold">
        <span>{icon}</span>
        <span>{label}</span>
      </div>

      <div className="px-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-light-green">
              {formatNumber(current)}
            </p>
            <p className="text-sm font-semibold text-orange">
              {formatNumber(safeTarget)}
            </p>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-light-green/30">
            <div
              className="h-full rounded-full bg-light-green transition-all duration-300"
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

export default function MilestonePerformanceStats({
  reach = 0,
  views = 0,
  comments = 0,
  likes = 0,
  targetReach = 0,
  targetViews = 0,
  targetComments = 0,
  targetLikes = 0,
}: Props) {
  const stats: StatCardProps[] = [
    {
      label: "Reach",
      icon: <FaEye />,
      current: reach,
      target: targetReach,
    },
    {
      label: "Views",
      icon: <FaPlay />,
      current: views,
      target: targetViews,
    },
    {
      label: "Comments",
      icon: <FaComment />,
      current: comments,
      target: targetComments,
    },
    {
      label: "Likes",
      icon: <FaHeart />,
      current: likes,
      target: targetLikes,
    },
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}