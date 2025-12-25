"use client";

import { IoMdCloseCircle } from "react-icons/io";
import { FaExclamationTriangle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type issuesType = {
  id: number;
  reason: string;
  date: string;
};
const ActionRequiredCard = () => {
  const t = useTranslations("influencer.dashboard.actionRequired");
  const issues: issuesType[] = [
    {
      id: 1,
      reason: "Trade License Rejected",
      date: "25 Dec 2025, 4:30pm",
    },
    {
      id: 2,
      reason: "NID Rejected",
      date: "25 Dec 2025, 4:30pm",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2d5016]">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Card */}
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="bg-[#FFF4EE] rounded-lg p-3 lg:p-4 flex justify-between items-center overflow-x-scroll no-scrollbar"
          >
            <div className="flex items-center justify-center gap-4">
              <span>
                <FaExclamationTriangle className="fill-amber-500" size={34}/>
              </span>
              <div>
                <h1 className="font-semibold text-black">{issue.reason}</h1>
                <p className="text-dark-gray text-sm">{issue.date}</p>
              </div>
            </div>
            <button className="bg-[#F09A30] rounded-md px-7 py-1.5 text-white text-sm">Fix</button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActionRequiredCard;
