"use client";

import Link from "next/link";
import React, { JSX, useMemo } from "react";
import { FaClock } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import StarRating from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/star-rating";

/** -------------------------
 * Types + Mock Data
 * -------------------------- */
type Platform = "instagram" | "youtube" | "tiktok";

type Influencer = {
  id: string;
  name: string;
  avatarUrl?: string;
};

type InfluencerCampaign = {
  id: string;
  influencer: Influencer;
};

type Quote = {
  baseBudget: {
    amount: number;
    currency: "BDT";
  };
};

type Deadline = {
  date: string; // ISO
};

type Rating = {
  averageStars: number; // 0-5
  totalReviews?: number;
};

type CampaignStatus = "Draft" | "Pending" | "Running" | "Completed" | "Cancelled";

type CampaignDetails = {
  id: string;
  title: string;
  status: CampaignStatus;
  platforms: Platform[];
  selectedInfluencerId?: string;
  influencerCampaigns: InfluencerCampaign[];
  quote?: Quote;
  deadline?: Deadline;
  rating?: Rating;
};

const campaignMocksData: CampaignDetails[] = [
  {
    id: "cmp_001",
    title: "Winter Skincare Launch",
    status: "Completed",
    platforms: ["instagram", "tiktok"],
    selectedInfluencerId: "inf_001",
    influencerCampaigns: [
      {
        id: "ic_001",
        influencer: {
          id: "inf_001",
          name: "Ayesha Rahman",
          avatarUrl: "/images/avatar-1.png",
        },
      },
      {
        id: "ic_002",
        influencer: {
          id: "inf_002",
          name: "Nayeem Hasan",
          avatarUrl: "/images/avatar-2.png",
        },
      },
      {
        id: "ic_003",
        influencer: {
          id: "inf_003",
          name: "Rafiul Islam",
          avatarUrl: "/images/avatar-3.png",
        },
      },
    ],
    quote: {
      baseBudget: { amount: 45000, currency: "BDT" },
    },
    deadline: { date: "2026-01-28T00:00:00.000Z" },
    rating: { averageStars: 4.6, totalReviews: 38 },
  },
  {
    id: "cmp_002",
    title: "Gadget Review Campaign",
    status: "Completed",
    platforms: ["youtube", "instagram"],
    selectedInfluencerId: "inf_004",
    influencerCampaigns: [
      {
        id: "ic_101",
        influencer: {
          id: "inf_004",
          name: "Tahsin Ahmed",
          avatarUrl: "/images/avatar-4.png",
        },
      },
      {
        id: "ic_102",
        influencer: {
          id: "inf_005",
          name: "Nusrat Jahan",
          avatarUrl: "/images/avatar-5.png",
        },
      },
    ],
    quote: {
      baseBudget: { amount: 90000, currency: "BDT" },
    },
    deadline: { date: "2026-02-02T00:00:00.000Z" },
    rating: { averageStars: 4.2, totalReviews: 21 },
  },
  {
    id: "cmp_003",
    title: "Restaurant Promo Week",
    status: "Running",
    platforms: ["instagram"],
    influencerCampaigns: [
      {
        id: "ic_201",
        influencer: { id: "inf_006", name: "Mahi", avatarUrl: "/images/avatar-6.png" },
      },
    ],
    quote: { baseBudget: { amount: 25000, currency: "BDT" } },
    deadline: { date: "2026-02-20T00:00:00.000Z" },
    rating: { averageStars: 0 },
  },
];

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
    c.influencerCampaigns.find((x) => x.influencer.id === c.selectedInfluencerId) ??
    c.influencerCampaigns[0];

  const name = selected?.influencer.name ?? "Influencer";

  const avatars = c.influencerCampaigns
    .map((x) => x.influencer.avatarUrl)
    .filter(Boolean)
    .slice(0, 2);

  // ✅ if more than 1 influencer total, show +N (excluding selected)
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
          <h3 className="text-Primary font-semibold leading-tight">{campaign.title}</h3>
          <p className="text-dark-gray text-xs">Influencer Promotion</p>
        </div>

        {/* Influencer preview */}
        <div className="flex items-center gap-3">
          <AvatarStack avatars={preview.avatars.length ? preview.avatars : ["", ""]} />
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
                {platformIcons[p]}
              </span>
            ))}
          </div>
        </div>

        {/* Offered box */}
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
    () => campaignMocksData.filter((c) => c.status === "Completed"),
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
