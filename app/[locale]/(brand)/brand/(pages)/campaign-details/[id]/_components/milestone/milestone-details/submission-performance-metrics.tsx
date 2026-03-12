"use client";

import {
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  Play,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { SubmissionMetricRow } from "@/types/client/campaigns/campaign-submission.types";

type Props = {
  metrics: SubmissionMetricRow[];
};

function formatMetricValue(value: number) {
  if (value >= 1000000) return `${Math.round(value / 100000) / 10}M`;
  if (value >= 1000) return `${Math.round(value / 100) / 10}K`;
  return `${value}`;
}

function getMetricIcon(key: string) {
  switch (key) {
    case "reach":
      return <Eye className="h-4 w-4" />;
    case "likes":
      return <Heart className="h-4 w-4 fill-current" />;
    case "views":
      return <Play className="h-4 w-4 fill-current" />;
    case "comments":
      return <MessageCircle className="h-4 w-4 fill-current" />;
    default:
      return <BarChart3 className="h-4 w-4" />;
  }
}

export default function SubmissionPerformanceMetrics({ metrics }: Props) {
  if (!metrics.length) {
    return (
      <div className="text-sm text-black/50">
        No performance target available for this submission.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold text-black">
        <BarChart3 className="h-4 w-4" />
        <span>Performance Metrics</span>
      </div>

      <div className="mt-6 space-y-7">
        {metrics.map((metric) => (
          <div key={metric.key}>
            <div className="flex items-center gap-2 text-sm text-black">
              {getMetricIcon(metric.key)}
              <span>{metric.label}</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-[30px] font-semibold leading-none">
              <span className="text-[#7BA35A]">
                {formatMetricValue(metric.achieved)}
              </span>
              <span className="text-[#D8892B]">
                {formatMetricValue(metric.target)}
              </span>
            </div>

            <Progress
              value={Math.min(metric.percent, 100)}
              className="mt-3 h-2"
            />

            <p className="mt-2 text-xs text-[#D8892B]">
              Target Hit {metric.percent}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}