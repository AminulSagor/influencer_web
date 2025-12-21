"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const campaigns = [
  {
    date: "Dec",
    day: "12",
    title: "Summer Fashion Campaign",
    milestonesLeft: 2,
    link: "/",
  },
  {
    date: "Jan",
    day: "05",
    title: "Winter Clearance Sale",
    milestonesLeft: 4,
    link: "/",
  },
  {
    date: "Feb",
    day: "18",
    title: "New Brand Launch",
    milestonesLeft: 1,
    link: "/",
  },
];

const UpcomingDeadline = () => {
  const t = useTranslations("influencer.dashboard.upcomingDeadline");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2d5016]">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {campaigns.map((item, index) => (
          <div key={index} className="flex">
            <div className="w-4 bg-[#2d5016]"></div>

            <div className="bg-secondary w-full p-2 space-y-4 rounded-br-lg rounded-tr-lg">
              <div className="flex justify-between items-center gap-4">
                <p className="text-center font-semibold text-[#2d5016] text-sm">
                  {item.date} <br />
                  {item.day}
                </p>

                <div className="flex-1">
                  <h3 className="font-semibold text-[#2d5016] text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {item.milestonesLeft} {t("milestone")}
                  </p>
                </div>

                <Button variant="link" size="sm" className="p-0">
                  <Link href={item.link} className="flex items-center text-xs">
                    {t("view")} <ChevronRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadline;
