"use client";

import React from "react";
import { useTranslations } from "next-intl";

import CampaignsLink from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/campaigns-links";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = Readonly<{
  children: React.ReactNode;
  onCreateCampaign?: () => void;
}>;

export default function InfluencerJobsLayout({
  children,
  onCreateCampaign,
}: Props) {
  const t = useTranslations("brand.campaigns.campaignsList");

  return (
    <div className="xl:p-4">
      <Card className="overflow-hidden">
        <div className="border-b bg-background px-4 pb-4">
          {/* Desktop: 3 columns | Mobile: stacked */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Left */}
            <div className="">
              <CardTitle className="truncate text-lg font-bold text-Primary">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-sm">
                {t("description")}
              </CardDescription>
            </div>

            {/* Center button */}
            <div className="">
              <Button
                type="button"
                className="w-full sm:w-auto bg-light-green hover:bg-light-green/85"
                onClick={onCreateCampaign}
              >
                + Create Campaign
              </Button>
            </div>

            {/* Right links */}
            <div className="">
              <CampaignsLink />
            </div>
          </div>
        </div>

        <CardContent className="p-4 md:p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
