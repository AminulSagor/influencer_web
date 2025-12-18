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
import { JSX } from "react";
import { AiFillTikTok } from "react-icons/ai";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaClock } from "react-icons/fa";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";
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
  },
];

const platformIcons: Record<string, JSX.Element> = {
  instagram: <RiInstagramFill size={30} className="fill-light-green" />,
  youtube: <RiYoutubeFill size={30} className="fill-light-green" />,
  tiktok: <AiFillTikTok size={30} className="fill-light-green" />,
};

const NewOfferList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
              <div className="border border-light-green rounded-lg bg-linear-to-r from-Secondary to-white px-4 py-7 space-y-2 ">
                <p className="text-Primary text-xs font-semibold">Offered</p>
                <p className="text-light-green text-2xl font-semibold">
                  ৳{offer.totalBudget.toLocaleString()}
                </p>
              </div>

              {/* Deadline */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="flex items-center gap-1 text-sm text-yellow-600">
                    <FaClock /> Deadline
                  </p>
                  <p className="text-yellow-600 text-sm">{offer.deadline}</p>
                </div>
                <div className="flex justify-between">
                  <p className="flex items-center gap-1 text-sm text-yellow-600">
                    <BsFillCalendarDateFill /> Duration
                  </p>
                  <p className="text-yellow-600 text-sm">{offer.duration}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-light-green text-white">
                  Accept
                </Button>
                <Button variant="outline" className="flex-1">
                  Decline
                </Button>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default NewOfferList;
