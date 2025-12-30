"use client";

import Link from "next/link";
import { JSX, useMemo } from "react";
import { FaClock } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { campaignMocksData } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/data";


type Platform = "instagram" | "youtube" | "tiktok";

export const platformIcons: Record<Platform, JSX.Element> = {
  instagram: <RiInstagramFill size={26} className="fill-light-green" />,
  youtube: <RiYoutubeFill size={26} className="fill-light-green" />,
  tiktok: <AiFillTikTok size={26} className="fill-light-green" />,
};

function formatDateLabel(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

const CampaignDraftList = () => {
  const drafts = useMemo(
    () => campaignMocksData.filter((c) => c.tabStatus === "Draft"),
    []
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4">
      {drafts.map((campaign) => {
        const deadlineLabel = formatDateLabel(campaign.deadline?.date);

        // Draft screen in your design shows "Offered: None"
        const offeredLabel = "None";

        return (
          <Card
            key={campaign.id}
            className="rounded-2xl border border-border/70 bg-white shadow-sm"
          >
            <CardContent className="p-5 space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <h3 className="text-Primary font-semibold leading-tight">
                  {campaign.title}
                </h3>
                <p className="text-dark-gray text-xs">Influencer Promotion</p>
              </div>

              {/* No influencers assigned */}
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  <Avatar className="h-7 w-7 border-2 border-white">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-[10px] bg-muted">
                      IN
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="h-7 w-7 border-2 border-white">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-[10px] bg-muted">
                      IN
                    </AvatarFallback>
                  </Avatar>
                </div>

                <p className="text-muted-foreground text-sm font-medium truncate">
                  No Influencers Assigned
                </p>
              </div>

              {/* Platforms */}
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground text-sm">Platforms</p>
                <div className="flex items-center gap-2">
                  {campaign.platforms.map((p) => (
                    <span key={p} className="leading-none" title={p}>
                      {platformIcons[p as Platform]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Offered box */}
              <div className="rounded-xl border border-border bg-muted/40 px-4 py-5 space-y-2">
                <p className="text-Primary text-base font-medium">Offered</p>
                <p className="text-light-green text-4xl font-semibold leading-none">
                  {offeredLabel}
                </p>
              </div>

              {/* Deadline */}
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-orange text-sm">
                  <FaClock className="text-orange" />
                  Deadline
                </p>
                <p className="text-orange text-sm">{deadlineLabel}</p>
              </div>

              {/* CTA */}
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href={`/brand/campaign-edit/${campaign.id}`}>
                  Continue Editing Campaign Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CampaignDraftList;
