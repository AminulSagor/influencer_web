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
import PercentageBar from "../../_components/percentage-bar";

// data/new-offers.ts
export const newOffers = [
  {
    id: 1,
    title: "Summer Fashion Campaign",
    clientName: "StyleCo",
    avatar: "/avatars/avatar-1.png",
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
    avatar: "/avatars/avatar-2.png",
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
    avatar: "/avatars/avatar-3.png",
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
    avatar: "/avatars/avatar-4.png",
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
    avatar: "/avatars/avatar-5.png",
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
    avatar: "/avatars/avatar-6.png",
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
  {
    id: 7,
    title: "Travel Vlog Sponsorship",
    clientName: "Wanderly",
    avatar: "/avatars/avatar-7.png",
    isNew: false,
    platforms: ["youtube"],
    totalBudget: 150000,
    profit: 22500,
    deadline: "Jan 18, 2026",
    duration: "15 days",
    timeLeft: "1D : 20H",
    requoteText: "Request to requote within 16 Jan, 2026, 4:00pm",
    completePercentage: 50,
  },
  {
    id: 8,
    title: "Food Delivery App Promo",
    clientName: "QuickBite",
    avatar: "/avatars/avatar-8.png",
    isNew: true,
    platforms: ["instagram", "tiktok"],
    totalBudget: 72000,
    profit: 10800,
    deadline: "Dec 22, 2025",
    duration: "5 days",
    timeLeft: "9H : 10M",
    requoteText: "Request to requote within 21 Dec, 2025, 8:00pm",
    completePercentage: 75,
  },
  {
    id: 9,
    title: "Gaming Gear Launch",
    clientName: "PixelForge",
    avatar: "/avatars/avatar-9.png",
    isNew: false,
    platforms: ["youtube", "tiktok"],
    totalBudget: 210000,
    profit: 31500,
    deadline: "Jan 25, 2026",
    duration: "18 days",
    timeLeft: "4D : 2H",
    requoteText: "Request to requote within 22 Jan, 2026, 5:00pm",
    completePercentage: 60,
  },
  {
    id: 10,
    title: "Online Course Promotion",
    clientName: "SkillNest",
    avatar: "/avatars/avatar-10.png",
    isNew: true,
    platforms: ["instagram", "youtube"],
    totalBudget: 98000,
    profit: 14700,
    deadline: "Dec 30, 2025",
    duration: "12 days",
    timeLeft: "1D : 6H",
    requoteText: "Request to requote within 28 Dec, 2025, 2:00pm",
    completePercentage: 40,
  },
  {
    id: 11,
    title: "Home Decor Brand Boost",
    clientName: "UrbanNest",
    avatar: "/avatars/avatar-11.png",
    isNew: false,
    platforms: ["instagram"],
    totalBudget: 56000,
    profit: 8400,
    deadline: "Jan 08, 2026",
    duration: "8 days",
    timeLeft: "22H : 40M",
    requoteText: "Request to requote within 06 Jan, 2026, 1:00pm",
    completePercentage: 55,
  },
  {
    id: 12,
    title: "AI SaaS Product Launch",
    clientName: "CloudMind",
    avatar: "/avatars/avatar-12.png",
    isNew: true,
    platforms: ["youtube", "linkedin"],
    totalBudget: 400000,
    profit: 60000,
    deadline: "Feb 10, 2026",
    duration: "25 days",
    timeLeft: "7D : 10H",
    requoteText: "Request to requote within 06 Feb, 2026, 12:00pm",
    completePercentage: 70,
  },
  {
    id: 13,
    title: "E-commerce Flash Sale",
    clientName: "DealHub",
    avatar: "/avatars/avatar-13.png",
    isNew: false,
    platforms: ["instagram", "facebook"],
    totalBudget: 134000,
    profit: 20100,
    deadline: "Dec 27, 2025",
    duration: "6 days",
    timeLeft: "16H : 55M",
    requoteText: "Request to requote within 26 Dec, 2025, 6:30pm",
    completePercentage: 85,
  },
  {
    id: 14,
    title: "Music Streaming App Push",
    clientName: "BeatFlow",
    avatar: "/avatars/avatar-14.png",
    isNew: true,
    platforms: ["tiktok", "instagram"],
    totalBudget: 89000,
    profit: 13350,
    deadline: "Jan 02, 2026",
    duration: "9 days",
    timeLeft: "11H : 15M",
    requoteText: "Request to requote within 31 Dec, 2025, 10:00am",
    completePercentage: 45,
  },
  {
    id: 15,
    title: "Fintech Wallet Awareness",
    clientName: "PaySphere",
    avatar: "/avatars/avatar-15.png",
    isNew: false,
    platforms: ["youtube", "instagram"],
    totalBudget: 275000,
    profit: 41250,
    deadline: "Feb 05, 2026",
    duration: "28 days",
    timeLeft: "6D : 18H",
    requoteText: "Request to requote within 01 Feb, 2026, 3:00pm",
    completePercentage: 70,
  },
];

const platformIcons: Record<string, JSX.Element> = {
  instagram: <RiInstagramFill size={30} className="fill-light-green" />,
  youtube: <RiYoutubeFill size={30} className="fill-light-green" />,
  tiktok: <AiFillTikTok size={30} className="fill-light-green" />,
};

const ActiveJobList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4">
      {newOffers.map((offer) => (
        <Card key={offer.id} className="relative overflow-hidden">
          {offer.isNew && (
            <Badge className="absolute top-0 right-0 rounded-bl-lg rounded-tr-none rounded-tl-none rounded-br-none bg-light-green text-white px-3 py-1 text-xs">
              New
            </Badge>
          )}

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
                  Platforms
                </p>
                <div className="flex gap-2">
                  {offer.platforms.map((p) => (
                    <span key={p}>{platformIcons[p]}</span>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="border border-border bg-secondary  rounded-lg  px-4 py-2 space-y-2">
                <p className="text-Primary text-xs font-semibold">
                  Total Budget
                </p>
                <p className="text-light-green text-2xl font-semibold">
                  ৳{offer.totalBudget.toLocaleString()}
                </p>
                <Separator className="bg-primary/10" />
                <p className="text-Primary text-sm font-semibold">
                  Your Profit (15%) : ৳{offer.profit.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-xs">
                  Platform fee 2% included
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="flex items-center gap-1 text-sm text-yellow-600">
                    <FaClock /> Deadline
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

              {/* Timer */}
              <div className="text-center">
                <p className="text-yellow-600 font-semibold text-3xl">
                  {offer.timeLeft}
                </p>
                <p className="text-Primary text-sm font-semibold">
                  Left to requote
                </p>
              </div>

              {/* Actions */}
              <Button variant="outline" className="w-full cursor-pointer">
                View Campaign Details
              </Button>
            </CardContent>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default ActiveJobList;
