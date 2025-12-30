"use client";

import Link from "next/link";
import { JSX, useMemo } from "react";
import { FaClock } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import StarRating from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/star-rating";

import type { CampaignDetails } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/types";
import { campaignMocksData } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/data";

type Platform = "instagram" | "youtube" | "tiktok";

const platformIcons: Record<Platform, JSX.Element> = {
  instagram: <RiInstagramFill size={26} className="fill-light-green" />,
  youtube: <RiYoutubeFill size={26} className="fill-light-green" />,
  tiktok: <AiFillTikTok size={26} className="fill-light-green" />,
};

const formatBDT = (amount: number) => `৳${amount.toLocaleString("en-US")}`;

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

function AvatarStack({ avatars }: { avatars: Array<string | undefined> }) {
  const a1 = avatars[0];
  const a2 = avatars[1];

  return (
    <div className="flex items-center -space-x-2">
      <Avatar className="h-7 w-7 border-2 border-white">
        <AvatarImage src={a1 ?? ""} />
        <AvatarFallback className="text-[10px] bg-muted">IN</AvatarFallback>
      </Avatar>

      <Avatar className="h-7 w-7 border-2 border-white">
        <AvatarImage src={a2 ?? ""} />
        <AvatarFallback className="text-[10px] bg-muted">IN</AvatarFallback>
      </Avatar>
    </div>
  );
}

function getPreviewInfluencer(c: CampaignDetails) {
  const selected =
    c.influencerCampaigns.find(
      (x) => x.influencer.id === c.selectedInfluencerId
    ) ?? c.influencerCampaigns[0];

  const name = selected?.influencer.name ?? "Influencer";

  const avatars = c.influencerCampaigns
    .map((x) => x.influencer.avatarUrl)
    .filter(Boolean)
    .slice(0, 2);

  const extraCount = Math.max(0, c.influencerCampaigns.length - 1);

  return { name, avatars, extraCount };
}

function CompletedCampaignCard({ campaign }: { campaign: CampaignDetails }) {
  const preview = getPreviewInfluencer(campaign);

  const offeredAmount = campaign.quote?.baseBudget?.amount ?? 0;
  const completedOnLabel = formatDateLabel(campaign.deadline?.date);
  const stars = campaign.rating?.averageStars ?? 0;

  return (
    <Card className="rounded-2xl border border-border/70 bg-white shadow-sm">
      <CardContent className="p-5 space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-Primary font-semibold leading-tight">
            {campaign.title}
          </h3>
          <p className="text-dark-gray text-xs">Influencer Promotion</p>
        </div>

        {/* Influencer preview (like screenshot) */}
        <div className="flex items-center gap-3">
          <AvatarStack
            avatars={preview.avatars.length ? preview.avatars : ["", ""]}
          />
          <p className="text-orange text-sm font-medium truncate">
            {preview.name}
            {preview.extraCount > 0 ? `, +${preview.extraCount}` : ""}
          </p>
        </div>

        {/* Platforms */}
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">Platforms</p>
          <div className="flex items-center gap-2">
            {campaign.platforms.map((p) => (
              <span key={p} className="leading-none">
                {platformIcons[p as Platform]}
              </span>
            ))}
          </div>
        </div>

        {/* Offered box (grey like screenshot) */}
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-5 space-y-2">
          <p className="text-Primary text-base font-medium">Offered</p>
          <p className="text-light-green text-4xl font-semibold leading-none">
            {formatBDT(offeredAmount)}
          </p>
        </div>

        {/* Completed On */}
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-orange text-sm">
            <FaClock className="text-orange" />
            Completed On
          </p>
          <p className="text-orange text-sm">{completedOnLabel}</p>
        </div>

        {/* Stars */}
        <div className="py-1">
          <StarRating rating={stars} />
        </div>

        {/* CTA */}
        <Button asChild variant="outline" className="w-full rounded-xl">
          <Link href={`/brand/campaign-details-influencer/${campaign.id}`}>
            View Campaign Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

const CompletedJobList = () => {
  const completedCampaigns = useMemo(
    () => campaignMocksData.filter((c) => c.tabStatus === "Completed"),
    []
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4">
      {completedCampaigns.map((c) => (
        <CompletedCampaignCard key={c.id} campaign={c} />
      ))}
    </div>
  );
};

export default CompletedJobList;
