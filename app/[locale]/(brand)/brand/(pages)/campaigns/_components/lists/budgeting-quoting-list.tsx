"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CampaignApi, CampaignMilestoneApi } from "@/app/[locale]/(brand)/brand/types/client-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaClock } from "react-icons/fa";


import { formatBDT, toNumberSafe, formatDateLabel } from "../../_lib/card-helpers";
import { getPlatformIcon } from "@/helpers/platforms";
import ListShell from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/list-shell";

type BQFilter = "all" | "budget_pending" | "quotation_received";

function getPlatformsFromCampaign(c: CampaignApi): string[] {
  const raw = (c.milestones ?? [])
    .map((m: CampaignMilestoneApi) => String(m?.platform ?? "").trim())
    .filter(Boolean);

  return Array.from(new Set(raw));
}

function calcDeadlineIso(c: CampaignApi) {
  if (!c.startingDate || !c.duration) return null;
  const d = new Date(c.startingDate);
  d.setDate(d.getDate() + c.duration);
  return d.toISOString();
}


function isBudgetPending(c: CampaignApi) {
  const s = String(c.status ?? "").toLowerCase();
  return s === "received" || s === "negotiating";
}

/** client accepted quotation */
function isQuotationReceived(c: CampaignApi) {
  return String(c.paymentStatus ?? "").toLowerCase() === "confirmed";
}

function applyBQFilter(items: CampaignApi[], filter: BQFilter) {
  if (filter === "all") return items;

  if (filter === "budget_pending") {
    // keep it status-based
    return items.filter(isBudgetPending);
  }

  return items.filter(isQuotationReceived);
}

function BudgetingCard({ c }: { c: CampaignApi }) {
  const offered = toNumberSafe(c.totalBudget) || toNumberSafe(c.baseBudget);
  const platforms = getPlatformsFromCampaign(c);

  const deadlineIso = calcDeadlineIso(c);
  const deadlineText = formatDateLabel(deadlineIso);

  const showQuotationReceived = isQuotationReceived(c);

  return (
    <Card className="rounded-2xl border border-border/70 bg-white shadow-sm">
      <CardContent className="p-5 space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-Primary font-semibold leading-tight">
            {c.campaignName}
          </h3>
          <p className="text-dark-gray text-xs">Influencer Promotion</p>
        </div>

        {/* Platforms */}
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">Platforms</p>

          <div className="flex items-center gap-2">
            {platforms.length ? (
              platforms.map((p) => (
                <span key={p} className="leading-none">
                  {getPlatformIcon(p, "h-6 w-6 text-light-green")}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">—</span>
            )}
          </div>
        </div>

        {/* Correct Box */}
        {!showQuotationReceived ? (
          <div className="rounded-xl border bg-muted/30 px-4 py-4 space-y-1">
            <p className="text-Primary text-xs font-semibold">Budget Pending</p>
            <p className="text-light-green text-3xl font-semibold">
              {formatBDT(offered)}
            </p>

            {/* revision count not in CampaignApi; show dash for now */}
            <p className="text-muted-foreground text-xs">Revised: —</p>
          </div>
        ) : (
          <div className="rounded-xl border border-light-green/25 bg-light-green/10 px-4 py-4 space-y-1">
            <p className="text-Primary text-xs font-semibold">
              Quotation Received
            </p>

            <p className="text-light-green text-3xl font-semibold">
              {formatBDT(offered)}
            </p>

            <p className="text-muted-foreground text-xs">
              Payment Status: Confirmed
            </p>
          </div>
        )}

        {/* Deadline */}
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm text-orange">
            <FaClock className="text-orange" />
            Deadline
          </p>
          <p className="text-orange text-sm">{deadlineText}</p>
        </div>

        <Button asChild variant="outline" className="w-full rounded-xl">
          <Link href={`/brand/campaign-details-influencer/${c.id}`}>
            View Campaign Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function BudgetingQuotingList({
  campaigns,
  loading,
}: {
  campaigns: CampaignApi[];
  loading?: boolean;
}) {
  const [filter, setFilter] = useState<BQFilter>("all");

  const filtered = useMemo(
    () => applyBQFilter(campaigns, filter),
    [campaigns, filter]
  );

  const countAll = campaigns.length;
  const countBudget = campaigns.filter(isBudgetPending).length;
  const countQuote = campaigns.filter(isQuotationReceived).length;

  return (
    <>
      {/*mini tabs */}
      <div className="flex flex-wrap gap-2 mt-6">
        {(
          [
            ["all", `All (${countAll})`],
            ["budget_pending", `Budget Pending (${countBudget})`],
            ["quotation_received", `Quotation Received (${countQuote})`],
          ] as Array<[BQFilter, string]>
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
        empty={!loading && filtered.length === 0}
        emptyTitle="No budgeting & quoting campaigns found."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4 mt-6">
          {filtered.map((c) => (
            <BudgetingCard key={c.id} c={c} />
          ))}
        </div>
      </ListShell>
    </>
  );
}
