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
    <div>
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="border-b pb-4">
            {/* Desktop: 3 columns | Mobile: stacked */}
            <div className="grid lg:grid-cols-3 gap-4">
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
                  className="sm:w-auto bg-light-green hover:bg-light-green/85"
                  onClick={onCreateCampaign}
                >
                  <Link href={'/brand/create-campaign'}>
                  + Create Campaign
                  </Link>
                </Button>
              </div>

              {/* Right links */}
              <div className="overflow-y-scroll pb-4 md:pb-0 no-scrollbar">
                <CampaignsLink />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">{children}</CardContent>
      </Card>
    </div>
  );
}
