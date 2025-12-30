"use client";

import Link from "next/link";
import { JSX, useMemo } from "react";
import { AiFillTikTok } from "react-icons/ai";
import { FaClock } from "react-icons/fa";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import PercentageBar from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/percentage-bar";

import { campaignMocksData } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/data";
import { CampaignDetails } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/types";

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

// Matches your Figma list card feeling (Paid ≈ 75%)
function stageToPercent(stage: CampaignDetails["stage"]): number {
  switch (stage) {
    case "Submitted":
      return 25;
    case "Quoted":
      return 50;
    case "Paid":
      return 75;
    case "Promoting":
      return 90;
    case "Completed":
      return 100;
    default:
      return 0;
  }
}

function buildDueLabel(daysRemainingLabel?: string) {
  if (!daysRemainingLabel) return "Due: —";

  const m = daysRemainingLabel.match(/(\d+)\s*Days/i);
  if (m?.[1]) return `Due: ${m[1]} Days`;

  if (/completed/i.test(daysRemainingLabel)) return "Completed";
  if (/cancelled|canceled/i.test(daysRemainingLabel)) return "Cancelled";
  if (/draft/i.test(daysRemainingLabel)) return "Draft";

  return daysRemainingLabel;
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

function ActiveCampaignCard({ campaign }: { campaign: CampaignDetails }) {
  const preview = getPreviewInfluencer(campaign);

  const offeredAmount = campaign.quote?.baseBudget?.amount ?? 0;
  const deadlineLabel = formatDateLabel(campaign.deadline?.date);
  const dueLabel = buildDueLabel(campaign.deadline?.daysRemainingLabel);
  const progressPercent = stageToPercent(campaign.stage);

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

        {/* Influencer */}
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

        {/* Offered box */}
        <div className="rounded-xl border border-light-green/25 bg-light-green/10 px-4 py-4 space-y-1">
          <p className="text-Primary text-xs font-semibold">Offered</p>
          <p className="text-light-green text-3xl font-semibold">
            {formatBDT(offeredAmount)}
          </p>
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm text-orange">
              <FaClock className="text-orange" />
              Deadline
            </p>
            <p className="text-orange text-sm">{deadlineLabel}</p>
          </div>

          <div className="w-full rounded-lg border border-orange bg-orange/10 px-4 py-2 text-center text-sm font-medium text-orange">
            {dueLabel}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <p className="text-orange text-sm font-medium">
            {Math.round(progressPercent)}% Complete
          </p>
          <PercentageBar value={progressPercent} />
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

const ActiveCampaignsList = () => {
  const activeCampaigns = useMemo(
    () => campaignMocksData.filter((c) => c.tabStatus === "Active"),
    []
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4">
      {activeCampaigns.map((c) => (
        <ActiveCampaignCard key={c.id} campaign={c} />
      ))}
    </div>
  );
};

export default ActiveCampaignsList;
