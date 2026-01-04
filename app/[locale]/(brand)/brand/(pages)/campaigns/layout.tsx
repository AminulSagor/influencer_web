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
import Link from "next/link";

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
    <Card className="overflow-hidden">
      <CardHeader className="pb-0 pt-0">
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left */}
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="truncate text-lg font-bold text-Primary">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-sm">
                {t("description")}
              </CardDescription>
            </div>

            <Button
              type="button"
              className="sm:w-auto bg-light-green hover:bg-light-green/85"
              onClick={onCreateCampaign}
            >
              <Link href={"/brand/create-campaign"}>+ Create Campaign</Link>
            </Button>
          </div>

          {/* Right links */}
          <div className="overflow-x-scroll lg:overflow-auto pb-2 md:pb-0 flex lg:justify-end">
            <div>
              <CampaignsLink />
            </div>
          </div>
        </div>
      </CardHeader>

      <div className="border w-full" />

      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}
