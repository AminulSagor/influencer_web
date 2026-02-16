"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CampaignSummary } from "@/app/[locale]/(brand)/brand/types/client-types";
import { Card, CardContent } from "@/components/ui/card";
import { FaClock } from "react-icons/fa";

import { formatBDT } from "../../_lib/card-helpers";
import ListShell from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/list-shell";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { formatDeadline } from "@/utils/date_util";
import { getPlatformIcon } from "@/utils/platforms_util";

type BudgetingFilter = "all" | "budget_pending" | "quotation_received";



export default function BudgetingAndQuotingCampaignsList({
  campaigns,
  loading,
}: {
  campaigns: CampaignSummary[];
  loading?: boolean;
}) {
  const [filter, setFilter] = useState<BudgetingFilter>("all");

  const filteredCampaigns = useMemo(
    () => applyBudgetingFilter(campaigns, filter),
    [campaigns, filter]
  );

  const totalCount = campaigns.length;
  const budgetPendingCount = campaigns.filter(isBudgetPendingCampaign).length;
  const quotationReceivedCount = campaigns.filter(
    isQuotationReceivedCampaign
  ).length;

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-6">
        {(
          [
            ["all", `All (${totalCount})`],
            ["budget_pending", `Budget Pending (${budgetPendingCount})`],
            [
              "quotation_received",
              `Quotation Received (${quotationReceivedCount})`,
            ],
          ] as Array<[BudgetingFilter, string]>
        ).map(([key, label]) => {
          const active = filter === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={[
                "px-4 py-2 rounded-full text-sm transition border",
                active
                  ? "bg-light-green text-white border-light-green"
                  : "bg-white text-Primary border-border hover:bg-Secondary",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      <ListShell
        loading={loading}
        empty={!loading && filteredCampaigns.length === 0}
        emptyTitle="No budgeting & quoting campaigns found."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 overflow-x-scroll gap-4 xl:gap-8 mt-6 items-start no-scrollbar">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id}>
              <BudgetingAndQuotingCampaignCard campaign={campaign} />
            </div>
          ))}
        </div>
      </ListShell>
    </>
  );
}

function isBudgetPendingCampaign(c: CampaignSummary) {
  const status = String(c.status ?? "").toLowerCase();
  return (
    status === "received" ||
    status === "negotiating" ||
    (c.budgetPendingAmount ?? 0) > 0
  );
}

function isQuotationReceivedCampaign(c: CampaignSummary) {
  return (c.totalQuotationsReceived ?? 0) > 0;
}

function applyBudgetingFilter(
  items: CampaignSummary[],
  filter: BudgetingFilter
) {
  if (filter === "all") return items;
  if (filter === "budget_pending") return items.filter(isBudgetPendingCampaign);
  return items.filter(isQuotationReceivedCampaign);
}

function BudgetingAndQuotingCampaignCard({
  campaign,
}: {
  campaign: CampaignSummary;
}) {
  const campaignType =
    campaign.campaignType === "paid_ad" ? "Paid Ad" : "Influencer Promotion";

  const isQuotationReceived = isQuotationReceivedCampaign(campaign);
  const offered = campaign.totalBudget;
  const deadlineText = formatDeadline(campaign.deadline);

  return (
    <Card className="py-8">
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-Primary text-lg font-semibold leading-tight">
            {campaign.campaignName}
          </h3>
          <p className="text-dark-gray text-sm">{campaignType}</p>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">Platforms</p>

          <div className="flex items-center gap-2">
            {campaign.platforms?.length ? (
              campaign.platforms.map((p) => (
                <span
                  key={p}
                  className="leading-none p-1.5 rounded-md bg-light-green"
                >
                  {getPlatformIcon(p, "h-4 w-4 text-white")}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">—</span>
            )}
          </div>
        </div>

        {!isQuotationReceived ? (
          <div className="rounded-xl border bg-linear-to-r from-Secondary to-white px-4 py-4 space-y-2">
            <p className="text-Primary text-lg font-semibold">Budget Pending</p>
            <p className="text-light-green text-3xl font-semibold">
              {offered > 0 ? formatBDT(offered) : "None"}
            </p>
            <p className="text-muted-foreground text-sm">
              Revised: {campaign.negotiationRevisedTimes ?? 0}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-light-green/25 bg-light-green/10 px-4 py-4 space-y-1">
            <p className="text-Primary text-xs font-semibold">
              Quotation Received
            </p>

            <p className="text-light-green text-3xl font-semibold">
              {offered > 0 ? formatBDT(offered) : "None"}
            </p>

            <p className="text-muted-foreground text-xs">
              Quotations: {campaign.totalQuotationsReceived ?? 0}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm text-orange">
            <FaClock className="text-orange" />
            Deadline
          </p>
          <p className="text-orange text-sm">{deadlineText}</p>
        </div>

        <SecondaryButton className="w-full text-Primary px-2 py-2">
          <Link href={`/brand/campaign-details-influencer/${campaign.id}`}>
            View Campaign Details
          </Link>
        </SecondaryButton>
      </CardContent>
    </Card>
  );
}
