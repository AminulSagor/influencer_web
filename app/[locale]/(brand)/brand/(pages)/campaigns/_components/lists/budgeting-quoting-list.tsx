"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { FaClock } from "react-icons/fa";

import { formatBDT } from "../../_lib/card-helpers";
import ListShell from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/list-shell";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { formatDeadline } from "@/utils/date_util";
import { getPlatformIcon } from "@/utils/platforms_util";
import type { CampaignOverView } from "@/types/client/campaigns/campaign-overview";
import {
  BUDGETING_FILTER_ITEMS,
  type BudgetingFilter,
} from "../../_lib/budgeting-status";
import { useBudgetingAndQuotingCounts } from "@/app/[locale]/(brand)/brand/hooks/useBudgetingAndQuotingCounts";

export default function BudgetingAndQuotingCampaignsList({
  campaigns,
  loading,
  filter,
  onFilterChange,
}: {
  campaigns: CampaignOverView[];
  loading?: boolean;
  filter: BudgetingFilter;
  onFilterChange: (filter: BudgetingFilter) => void;
}) {
  const t = useTranslations("brand.CampaignsPage");
  const counts = useBudgetingAndQuotingCounts(true);

  const countMap: Record<BudgetingFilter, number> = {
    all: counts.all,
    budget_pending: counts.budgetPending,
    quotation_received: counts.quotationReceived,
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-6">
        {BUDGETING_FILTER_ITEMS.map(({ key }) => {
          const active = filter === key;
          const count = countMap[key];

          return (
            <button
              key={key}
              type="button"
              onClick={() => onFilterChange(key)}
              className={[
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition border",
                active
                  ? "bg-light-green text-white border-light-green"
                  : "bg-white text-Primary border-border hover:bg-Secondary",
              ].join(" ")}
            >
              <span>{t(key)}</span>

              <span
                className={[
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-medium",
                  active
                    ? "bg-white text-light-green"
                    : "bg-red-500 text-white",
                ].join(" ")}
              >
                {counts.loading ? "0" : count}
              </span>
            </button>
          );
        })}
      </div>

      <ListShell
        loading={loading}
        empty={!loading && campaigns.length === 0}
        emptyTitle={t("noBudgetingQuotingCampaignsFound")}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 overflow-x-scroll gap-4 xl:gap-8 mt-6 items-start no-scrollbar">
          {campaigns.map((campaign) => (
            <div key={campaign.id}>
              <BudgetingAndQuotingCampaignCard campaign={campaign} />
            </div>
          ))}
        </div>
      </ListShell>
    </>
  );
}

function isQuotationReceivedCampaign(c: CampaignOverView) {
  return (c.totalQuotationsReceived ?? 0) > 0;
}

function BudgetingAndQuotingCampaignCard({
  campaign,
}: {
  campaign: CampaignOverView;
}) {
  const t = useTranslations("brand.CampaignsPage");

  const campaignType =
    campaign.campaignType === "paid_ad"
      ? t("paidAd")
      : t("influencerPromotion");

  const isQuotationReceived = isQuotationReceivedCampaign(campaign);
  const offered = campaign.totalBudget ?? 0;
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
          <p className="text-muted-foreground text-sm">{t("platforms")}</p>

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
            <p className="text-Primary text-lg font-semibold">
              {t("budgetPending")}
            </p>

            <p className="text-light-green text-3xl font-semibold">
              {offered > 0 ? formatBDT(offered) : t("none")}
            </p>

            <p className="text-muted-foreground text-sm">
              {t("revised")}: {campaign.negotiationRevisedTimes ?? 0}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-light-green/25 bg-light-green/10 px-4 py-4 space-y-2">
            <p className="text-Primary text-lg font-semibold">
              {t("quotationReceived")}
            </p>

            <p className="text-light-green text-3xl font-semibold">
              {campaign.totalQuotationsReceived ?? 0}
            </p>

            <p className="text-muted-foreground text-sm">
              {t("offered")}: {offered > 0 ? formatBDT(offered) : t("none")}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm text-orange">
            <FaClock className="text-orange" />
            {t("deadline")}
          </p>
          <p className="text-orange text-sm">{deadlineText}</p>
        </div>

        <SecondaryButton className="w-full text-Primary px-2 py-2">
          <Link href={`/brand/campaign-details/${campaign.id}`}>
            {t("viewCampaignDetails")}
          </Link>
        </SecondaryButton>
      </CardContent>
    </Card>
  );
}
