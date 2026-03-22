"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaClock } from "react-icons/fa";
import PercentageBar from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/percentage-bar";
import ListShell from "../list-shell";
import AvatarStack from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/avatar-stack";
import { getAssignedUserBasedText } from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/card-helpers";
import { buildDueLabelFromDeadline, formatDeadline } from "@/utils/date_util";
import { getPlatformIcon } from "@/utils/platforms_util";
import { CampaignOverView } from "@/types/client/campaigns/campaign-overview";
import { formatBudget } from "@/utils/fomat_budget_utils";

export default function ActiveCampaignsList({
  campaigns,
  loading,
}: {
  campaigns: CampaignOverView[];
  loading?: boolean;
}) {
  const t = useTranslations("brand.CampaignsPage");

  return (
    <ListShell
      loading={loading}
      empty={!loading && campaigns.length === 0}
      emptyTitle={t("noActiveCampaignsFound")}
    >
      <div className="grid gap-4 xl:gap-8 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => (
          <div key={c.id} className="w-full justify-self-start">
            <ActiveCard c={c} />
          </div>
        ))}
      </div>
    </ListShell>
  );
}

function ActiveCard({ c }: { c: CampaignOverView }) {
  const t = useTranslations("brand.CampaignsPage");

  const campaignType =
    c.campaignType === "paid_ad" ? t("paidAd") : t("influencerPromotion");

  const isAssigned = (c.assignedTo?.length ?? 0) > 0;
  const assignText = getAssignedUserBasedText(isAssigned, c.campaignType);
  const dueLabel = buildDueLabelFromDeadline(c.deadline);

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-Primary font-semibold leading-tight">
            {c.campaignName}
          </h3>
          <p className="text-dark-gray text-sm">{campaignType}</p>
        </div>

        <div className="flex gap-2 items-center">
          <AvatarStack users={c.assignedTo} />
          {!isAssigned && (
            <p className="text-xs text-dark-gray">{assignText}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">{t("platforms")}</p>
          <div className="flex items-center gap-2">
            {c.platforms.length ? (
              c.platforms.map((p) => (
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

        <div className="rounded-xl border border-light-green/25 bg-light-green/10 px-4 py-4 space-y-1">
          <p className="text-Primary text-lg">{t("offered")}</p>
          <p className="text-light-green text-3xl font-semibold">
            {formatBudget(c.totalBudget)}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm text-orange">
              <FaClock className="text-orange" />
              {t("deadline")}
            </p>
            <p className="text-orange text-sm">{formatDeadline(c.deadline)}</p>
          </div>

          <div className="w-full rounded-lg border-orange bg-orange/10 px-4 py-2 text-center text-sm text-orange border">
            {dueLabel}
          </div>
        </div>

        <PercentageBar value={c.progress} />

        <Button asChild variant="outline" className="w-full rounded-xl">
          <Link href={`/brand/campaign-details/${c.id}`}>
            {t("viewCampaignDetails")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
