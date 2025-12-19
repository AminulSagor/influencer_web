"use client";

import ButtonLinks from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/button-links";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import React from "react";

const InfluencerJobsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const t = useTranslations("influencer.jobs.jobMarketplace");

  return (
    <div className="p-4 border">
      <Card>
        {/* Header */}
        <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-Primary">
              {t("title")}
            </CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>

          {/* Button links */}
          <div className="w-full sm:w-auto">
            <ButtonLinks />
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="">{children}</CardContent>
      </Card>
    </div>
  );
};

export default InfluencerJobsLayout;
