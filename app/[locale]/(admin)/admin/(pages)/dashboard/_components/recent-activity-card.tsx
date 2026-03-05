import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { FaBangladeshiTakaSign, FaFile, FaStar } from "react-icons/fa6";
import { ImUserPlus } from "react-icons/im";
import { PiShieldCheckFill } from "react-icons/pi";
import { Card, CardTitle } from "@/components/ui/card";

// Import ScrollArea components
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Activity = {
  id: number;
  type:
    | "accepted"
    | "added"
    | "payment"
    | "newUser"
    | "completed"
    | "declined"
    | "verified"
    | "quoteSent"
    | "rated";
  title: string;
  timeAgo: string;
  // optionally other fields if needed
};

const iconMap = {
  accepted: {
    icon: IoCheckmarkSharp,
    bgColor: "bg-light-green-200",
    iconColor: "text-Primary",
    size: 25,
  },
  added: {
    icon: CiCirclePlus,
    bgColor: "bg-blue-100",
    iconColor: "text-Blue",
    size: 25,
  },
  payment: {
    icon: FaBangladeshiTakaSign,
    bgColor: "bg-purple-200",
    iconColor: "text-purple-600",
    size: 20,
  },
  newUser: {
    icon: ImUserPlus,
    bgColor: "bg-yellow-200",
    iconColor: "text-orange",
    size: 20,
  },
  completed: {
    icon: IoCheckmarkSharp,
    bgColor: "bg-light-green-200",
    iconColor: "text-Primary",
    size: 25,
  },
  declined: {
    icon: IoCloseSharp,
    bgColor: "bg-rose-100",
    iconColor: "text-rose-600",
    size: 25,
  },
  verified: {
    icon: PiShieldCheckFill,
    bgColor: "bg-blue-100",
    iconColor: "text-Blue",
    size: 25,
  },
  quoteSent: {
    icon: FaFile,
    bgColor: "bg-purple-200",
    iconColor: "text-purple-600",
    size: 20,
  },
  rated: {
    icon: FaStar,
    bgColor: "bg-yellow-200",
    iconColor: "text-orange",
    size: 20,
  },
};

const activities: Activity[] = [
  {
    id: 1,
    type: "accepted",
    title: "Hania Amir accepted job - ‘Summer Sale’",
    timeAgo: "2 minutes ago",
  },
  {
    id: 2,
    type: "added",
    title: "Hania Amir accepted job - ‘Summer Sale’",
    timeAgo: "2 minutes ago",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment of ৳33,200 processed to Hania Amir",
    timeAgo: "2 minutes ago",
  },
  {
    id: 4,
    type: "newUser",
    title: "New user registered as Influencer: Hania Amir",
    timeAgo: "2 minutes ago",
  },
  {
    id: 5,
    type: "completed",
    title: "Campaign Summer Sale completed",
    timeAgo: "2 minutes ago",
  },
  {
    id: 6,
    type: "declined",
    title: "@food_blogger declined job - ‘Summer Sale’",
    timeAgo: "2 minutes ago",
  },
  {
    id: 7,
    type: "verified",
    title: "Verification approved for TechStart Inc.",
    timeAgo: "2 minutes ago",
  },
  {
    id: 8,
    type: "quoteSent",
    title: "Quote sent to BeautyBrand Co.",
    timeAgo: "2 minutes ago",
  },
  {
    id: 9,
    type: "rated",
    title: "Client StyleCo rated the influencers",
    timeAgo: "2 minutes ago",
  },
];

const RecentActivityCard = () => {
  return (
    <Card className="p-0 gap-0">
      <div className="border-b">
        <div className="p-4">
          <CardTitle className="text-Primary">Recent Activity</CardTitle>
        </div>
      </div>
      <div className="p-4">
        <ScrollArea className="h-[360px]">
          <div className="space-y-2 pr-4">
            {activities.map(({ id, type, title, timeAgo }) => {
              const Icon = iconMap[type].icon;
              const bgColor = iconMap[type].bgColor;
              const iconColor = iconMap[type].iconColor;
              const size = iconMap[type].size;

              return (
                <div key={id} className="flex items-center gap-4">
                  <div
                    className={`h-10 aspect-square rounded-full ${bgColor} ${iconColor} flex items-center justify-center`}
                  >
                    <Icon size={size} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold">{title}</h2>
                    <p className="text-xs font-light text-gray-400">
                      {timeAgo}
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
