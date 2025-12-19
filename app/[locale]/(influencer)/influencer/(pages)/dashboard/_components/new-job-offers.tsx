"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const campaignActions = [
  {
    id: 1,
    title: "Summer Fashion Campaign",
    budget: 11107,
    link: "#",
  },
  {
    id: 2,
    title: "Winter Clearance Campaign",
    progress: "35%",
    budget: 24500,
    link: "#",
  },
  {
    id: 3,
    title: "New Brand Launch",
    budget: 5000,
    link: "#",
  },
];

const NewJobOffers = () => {
  const t = useTranslations("influencer.dashboard.newJobOffers");

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-[#2d5016]">{t("title")}</CardTitle>
        <div>
          <Button variant="link" size="sm" className="p-0 text-[#2d5016]">
            <Link href={"#"} className="flex items-center text-xs">
              {t("viewAll")}
              <ChevronRight />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {campaignActions.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg bg-secondary px-4 py-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-[#2d5016]">
                {item.title}
              </h3>

              <Button variant="link" size="sm" className="p-0 text-[#2d5016]">
                <Link href={item.link} className="flex items-center text-xs">
                  {t("view")} <ChevronRight />
                </Link>
              </Button>
            </div>

            <p className="text-sm font-medium text-[#2d5016]">
              {t("budget")}: ৳{item.budget.toLocaleString()}
            </p>

            <div className="flex gap-2 py-2">
              <Button className="flex-1 bg-[#7a9b57] hover:bg-[#5a7a3d] cursor-pointer">
                {t("accept")}
              </Button>
              <Button className="flex-1 cursor-pointer" variant="outline">
                {t("decline")}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NewJobOffers;
