import { IoCheckmarkSharp } from "react-icons/io5";
import { FaBangladeshiTakaSign, FaFile, FaStar } from "react-icons/fa6";
import { ImUserPlus } from "react-icons/im";
import { PiShieldCheckFill } from "react-icons/pi";
import { Card, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TfiMenuAlt } from "react-icons/tfi";

import {
  DashboardActivityItem,
  DashboardActivityType,
} from "@/types/admin/dashboard/dashboard_activity_type";

type Props = {
  activities: DashboardActivityItem[];
};

const formatRelativeTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const activityIconMap: Record<
  DashboardActivityType,
  {
    icon: React.ElementType;
    bgColor: string;
    iconColor: string;
    size: number;
  }
> = {
  campaign: {
    icon: TfiMenuAlt,
    bgColor: "bg-blue-100",
    iconColor: "text-Blue",
    size: 18,
  },
  submission: {
    icon: FaFile,
    bgColor: "bg-purple-200",
    iconColor: "text-purple-600",
    size: 18,
  },
  payment: {
    icon: FaBangladeshiTakaSign,
    bgColor: "bg-purple-200",
    iconColor: "text-purple-600",
    size: 18,
  },
  user: {
    icon: ImUserPlus,
    bgColor: "bg-yellow-200",
    iconColor: "text-orange",
    size: 18,
  },
  verification: {
    icon: PiShieldCheckFill,
    bgColor: "bg-blue-100",
    iconColor: "text-Blue",
    size: 20,
  },
  rating: {
    icon: FaStar,
    bgColor: "bg-yellow-200",
    iconColor: "text-orange",
    size: 18,
  },
};

const RecentActivityCard = ({ activities }: Props) => {
  return (
    <Card className="gap-0 p-0">
      <div className="border-b">
        <div className="p-4">
          <CardTitle className="text-Primary">Recent Activity</CardTitle>
        </div>
      </div>

      <div className="p-4">
        <ScrollArea className="h-[360px]">
          <div className="space-y-3 pr-4">
            {activities.map((activity, index) => {
              const config =
                activityIconMap[activity.type] ?? {
                  icon: IoCheckmarkSharp,
                  bgColor: "bg-light-green/20",
                  iconColor: "text-Primary",
                  size: 20,
                };

              const Icon = config.icon;

              return (
                <div key={`${activity.title}-${index}`} className="flex gap-4">
                  <div
                    className={`flex h-10 aspect-square items-center justify-center rounded-full ${config.bgColor} ${config.iconColor}`}
                  >
                    <Icon size={config.size} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold">{activity.title}</h2>
                    <p className="text-xs text-dark-gray">
                      {activity.description}
                    </p>
                    <p className="pt-1 text-xs font-light text-light-gray">
                      {formatRelativeTime(activity.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default RecentActivityCard;