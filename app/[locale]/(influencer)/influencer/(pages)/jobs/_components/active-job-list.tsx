import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Percent } from "lucide-react";
import { JSX } from "react";
import { AiFillTikTok } from "react-icons/ai";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaClock } from "react-icons/fa";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";
import PercentageBar from "../../../(pages)/jobs/_components/percentage-bar";
import { useTranslations } from "next-intl";

// data/new-offers.ts
export const newOffers = [
  {
    id: 1,
    title: "Summer Fashion Campaign",
    clientName: "StyleCo",
    avatar: "/avatar/avatar.png",
    isNew: true,
    platforms: ["instagram", "youtube"],
    totalBudget: 115000,
    profit: 11000,
    deadline: "Dec 15, 2025",
    duration: "14 days",
    timeLeft: "12H : 00M",
    requoteText: "Request to requote within 12 Dec, 2025, 12:00pm",
    completePercentage: 80,
  },
  {
    id: 2,
    title: "Winter Jacket Launch",
    clientName: "NorthWear",
    avatar: "/avatar/avatar.png",
    isNew: true,
    platforms: ["instagram", "tiktok"],
    totalBudget: 85000,
    profit: 12750,
    deadline: "Jan 05, 2026",
    duration: "10 days",
    timeLeft: "18H : 45M",
    requoteText: "Request to requote within 02 Jan, 2026, 9:00am",
    completePercentage: 45,
  },
  {
    id: 3,
    title: "Smartphone Review Series",
    clientName: "TechNova",
    avatar: "/avatar/avatar.png",
    isNew: false,
    platforms: ["youtube"],
    totalBudget: 240000,
    profit: 36000,
    deadline: "Dec 28, 2025",
    duration: "21 days",
    timeLeft: "2D : 6H",
    requoteText: "Request to requote within 26 Dec, 2025, 6:00pm",
    completePercentage: 40,
  },
  {
    id: 4,
    title: "Organic Skincare Promotion",
    clientName: "GlowPure",
    avatar: "/avatar/avatar.png",
    isNew: true,
    platforms: ["instagram"],
    totalBudget: 67000,
    profit: 10050,
    deadline: "Dec 20, 2025",
    duration: "7 days",
    timeLeft: "6H : 30M",
    requoteText: "Request to requote within 19 Dec, 2025, 3:00pm",
    completePercentage: 90,
  },
  {
    id: 5,
    title: "Fitness App Growth Campaign",
    clientName: "FitTrack",
    avatar: "/avatar/avatar.png",
    isNew: false,
    platforms: ["instagram", "youtube", "tiktok"],
    totalBudget: 190000,
    profit: 28500,
    deadline: "Jan 12, 2026",
    duration: "30 days",
    timeLeft: "3D : 12H",
    requoteText: "Request to requote within 08 Jan, 2026, 10:00am",
    completePercentage: 20,
  },
  {
    id: 6,
    title: "Luxury Watch Brand Awareness",
    clientName: "ChronoLux",
    avatar: "/avatar/avatar.png",
    isNew: true,
    platforms: ["youtube", "instagram"],
    totalBudget: 320000,
    profit: 48000,
    deadline: "Feb 01, 2026",
    duration: "20 days",
    timeLeft: "5D : 4H",
    requoteText: "Request to requote within 28 Jan, 2026, 11:00am",
    completePercentage: 30,
  },
];

const platformIcons: Record<string, JSX.Element> = {
  instagram: <RiInstagramFill size={30} className="fill-light-green" />,
  youtube: <RiYoutubeFill size={30} className="fill-light-green" />,
  tiktok: <AiFillTikTok size={30} className="fill-light-green" />,
};

const ActiveJobList = () => {
  const t = useTranslations("influencer.jobs");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4">
      {newOffers.map((offer) => (
        <Card key={offer.id} className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-Primary">{offer.title}</CardTitle>
            <CardDescription className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={offer.avatar} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <p className="text-yellow-600 text-sm font-medium">
                {offer.clientName}
              </p>
            </CardDescription>

            <CardContent className="p-0 space-y-4">
              {/* Platforms */}
              <div className="flex items-center gap-6">
                <p className="text-muted-foreground text-sm font-medium">
                  {t("Platforms")}
                </p>
                <div className="flex gap-2">
                  {offer.platforms.map((p) => (
                    <span key={p}>{platformIcons[p]}</span>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="border border-border bg-secondary  rounded-lg  px-4 py-5 space-y-2">
                <p className="text-Primary text-xs font-semibold">Offered</p>
                <p className="text-light-green text-2xl font-semibold">
                  ৳{offer.totalBudget.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="flex items-center gap-1 text-sm text-yellow-600">
                    <FaClock /> {t("Deadline")}
                  </p>
                  <p className="text-yellow-600 text-sm">{offer.deadline}</p>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-orange/20 border text-orange border-orange rounded-lg px-4 py-2  text-sm font-medium text-center">
                    Due: 3 Days
                  </div>
                </div>
              </div>

              <div>
                <PercentageBar value={offer.completePercentage} />
              </div>
              {/* Actions */}
              <Button variant="outline" className="w-full cursor-pointer">
                {t("View Campaign Details")}
              </Button>
            </CardContent>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default ActiveJobList;
