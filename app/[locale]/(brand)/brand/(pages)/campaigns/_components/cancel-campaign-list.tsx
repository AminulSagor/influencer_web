"use client";

import { JSX, useMemo } from "react";
import { FaClock } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { campaignMocksData } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/data";

type Platform = "instagram" | "youtube" | "tiktok";

export const platformIcons: Record<Platform, JSX.Element> = {
  instagram: <RiInstagramFill size={24} className="fill-dark-gray/60" />,
  youtube: <RiYoutubeFill size={24} className="fill-dark-gray/60" />,
  tiktok: <AiFillTikTok size={24} className="fill-dark-gray/60" />,
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

const CancelCampaignList = () => {
  const cancelled = useMemo(
    () => campaignMocksData.filter((c) => c.tabStatus === "Cancelled"),
    []
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4">
      {cancelled.map((campaign) => {
        const offeredAmount = campaign.quote?.baseBudget?.amount ?? 0;
        const deadlineLabel = formatDateLabel(campaign.deadline?.date);

        return (
          <Card
            key={campaign.id}
            className="rounded-2xl shadow-sm"
          >
            <CardContent className="p-5 space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <h3 className="text-dark-gray font-semibold leading-tight">
                  {campaign.title}
                </h3>
                <p className="text-dark-gray/70 text-xs">
                  Influencer Promotion
                </p>
              </div>

              {/* Brand row (grey avatar + brand name) */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={campaign.brand?.logoUrl ?? ""} />
                  <AvatarFallback className="text-[10px] bg-muted text-dark-gray/70">
                    BR
                  </AvatarFallback>
                </Avatar>

                <p className="text-dark-gray text-sm font-medium truncate">
                  {campaign.brand?.name ?? "Brand"}
                </p>
              </div>

              {/* Platforms */}
              <div className="flex items-center gap-4">
                <p className="text-dark-gray text-sm">Platforms</p>
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
                <p className="text-dark-gray text-xs font-semibold">Offered</p>
                <p className="text-dark-gray text-3xl font-semibold leading-none">
                  {formatBDT(offeredAmount)}
                </p>
              </div>

              {/* Deadline */}
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-dark-gray text-sm">
                  <FaClock className="text-dark-gray/70" />
                  Deadline
                </p>
                <p className="text-dark-gray text-sm">{deadlineLabel}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CancelCampaignList;
