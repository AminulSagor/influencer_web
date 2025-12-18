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
import {
  RiFacebookFill,
  RiInstagramFill,
  RiLinkedinFill,
  RiYoutubeFill,
} from "react-icons/ri";
import PercentageBar from "../../_components/percentage-bar";
import StarRating from "../../completed/_components/star-rating";

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
    rating: 4.5,
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
    rating: 3.0,
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
    rating: 3.5,
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
    rating: 5.0,
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
    rating: 2.5,
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
    rating: 3.0,
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
    rating: 4.0,
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
    rating: 4.0,
  },
];

export const platformIcons: Record<string, JSX.Element> = {
  instagram: <RiInstagramFill size={30} color="#cc7722" />,
  youtube: <RiYoutubeFill size={30} color="#cc7722" />,
  tiktok: <AiFillTikTok size={30} color="#cc7722" />,
  facebook: <RiFacebookFill size={30} color="#cc7722" />,
  linkedin: <RiLinkedinFill size={30} color="#cc7722" />,
};

const PendingJobList = () => {
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
            </CardDescription>

            <CardContent className="p-0 space-y-4">
              {/* Platforms */}
              <div className="flex items-center gap-6">
                <p className="text-muted-foreground text-sm font-medium">
                  Platforms
                </p>
                <div className="flex gap-2">
                  {offer.platforms.map((p) => (
                    <span key={p} title={p} className="cursor-pointer">
                      {platformIcons[p]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="border border-border bg-secondary  rounded-lg  px-4 py-5 space-y-2">
                <p className="text-orange text-xs font-semibold">
                  Total Budget
                </p>
                <p className="text-orange text-2xl font-semibold">
                  ৳{offer.totalBudget.toLocaleString()}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="flex items-center gap-1 text-sm text-yellow-600">
                    <FaClock /> Deadline
                  </p>
                  <p className="text-yellow-600 text-sm">{offer.deadline}</p>
                </div>
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

export default PendingJobList;
