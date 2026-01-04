"use client";

import Link from "next/link";
import { JSX, useMemo } from "react";
import { FaClock } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

/**
 * Matches your screenshot logic:
 * - Before quote -> "Budget Pending"
 * - After quote -> "Quotation Received"
 */
function getBudgetCardStatus(c: CampaignDetails) {
  if (c.stage === "Submitted") return "Budget Pending";
  if (c.stage === "Quoted") return "Quotation Received";
  return "Budget Pending";
}

/**
 * You don't have revisedTimes in your CampaignDetails type yet,
 * so we safely default to 0.
 * Later you can add: revisedTimes?: number on CampaignDetails.
 */
function getRevisedTimes(c: CampaignDetails) {
  return (c as any).revisedTimes ?? 0;
}

const BudgetingAndQuotingList = () => {
  const campaigns = useMemo(
    () =>
      campaignMocksData.filter((c) => c.tabStatus === "BudgetingAndQuoting" || c.tabStatus === "Pending"),
    []
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map((campaign) => {
        const statusText = getBudgetCardStatus(campaign);
        const amount = campaign.quote?.baseBudget?.amount ?? 0;
        const revisedTimes = getRevisedTimes(campaign);
        const deadlineLabel = formatDateLabel(campaign.deadline?.date);

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

              {/* Budget Pending / Quotation Received Box */}
              <div className="rounded-xl border border-border bg-muted/40 px-4 py-5">
                <div className="flex items-end justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-Primary text-base font-medium">
                      {statusText}
                    </p>

                    <p className="text-light-green text-4xl font-semibold leading-none">
                      {formatBDT(amount)}
                    </p>
                  </div>

                  <p className="text-muted-foreground text-xs whitespace-nowrap">
                    Revised: {revisedTimes} Times
                  </p>
                </div>
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
                <Link
                  href={`/brand/campaign-details-influencer/${campaign.id}`}
                >
                  View Campaign Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BudgetingAndQuotingList;
