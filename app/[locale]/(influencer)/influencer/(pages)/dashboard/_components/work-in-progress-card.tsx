"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { RiUser3Fill } from "react-icons/ri";
import { FaClock } from "react-icons/fa6";
import { Slider } from "@/components/ui/slider";
import { FaArrowRightLong } from "react-icons/fa6";
import { useTranslations } from "next-intl";

const WorkInProgressData = [
  {
    id: 1,
    title: "Summer Fashion Campaign",
    budget: 11000,
    dueDate: "Dec 15, 2025",
    dueInDays: 3,
    client: "StyleCo",
    progress: 75,
  },
  {
    id: 2,
    title: "Tech Product Launch",
    dueDate: "Jan 10, 2026",
    dueInDays: 32,
    client: "Acme Corp",
    budget: "55,000",
    progress: 90,
  },
  {
    id: 3,
    title: "Fitness Brand Partnership",
    dueDate: "Nov 30, 2025",
    dueInDays: -9,
    client: "WebTech",
    budget: "350,000",
    progress: 90,
  },
];

const WorkInProgressCard = () => {
  const t = useTranslations("influencer.dashboard.workInProgress");

  return (
    <Card>
      <CardHeader className="border-b flex items-center justify-between">
        <CardTitle className="text-[#2D5016]">{t("title")}</CardTitle>
        <CardAction>
          <Button className="bg-[#7A9B57]/90 hover:bg-[#7a9b57]" size={"sm"}>
            4 {t("active")}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {WorkInProgressData.map((data) => (
          <div className="border p-4 rounded-lg shadow-sm" key={data.id}>
            <div className="flex justify-between items-center space-y-1">
              <div className="space-y-1">
                <h3 className="font-semibold text-[#2d5016]">{data.title}</h3>
              </div>
              <div>
                <div className="bg-yellow-600/30 border-yellow-700 border px-4 py-1 rounded-lg flex justify-center items-center">
                  <span className="text-yellow-700 text-sm font-medium">
                    {t("due")} {data.dueInDays} Days
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-1">
              <span>
                <RiUser3Fill size={12} className="fill-yellow-600" />
              </span>
              <span className="text-xs text-yellow-600">{data.client}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span>
                  <FaClock size={12} className="fill-yellow-600" />
                </span>
                <span className="text-xs text-yellow-600">{data.dueDate}</span>
              </div>
            </div>
            <div className="pt-2">
              <Slider defaultValue={[data.progress]} max={100} step={1} />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-yellow-600 text-sm">
                {data.progress}% {t("complete")}
              </p>
              <Button variant="link" size={"sm"}>
                <Link href={"#"} className="flex items-center text-xs">
                  {t("view")} <ChevronRight />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-center">
        <Button className="w-full md:w-[50%] bg-[#F5F5DC]/60 text-[#2D5016] border-[#2D5016] border hover:bg-[#F5F5DC] hover:text-[#2D5016] hover:border-[#2D5016] cursor-pointer">
          {t("viewAllJobs")}
          <span>
            <FaArrowRightLong />
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkInProgressCard;
