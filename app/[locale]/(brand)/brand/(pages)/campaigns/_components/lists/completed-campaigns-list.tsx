"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { CampaignOverView } from "@/types/client/campaigns/campaign-overview";
import { Card, CardContent } from "@/components/ui/card";
import ListShell from "../list-shell";
import { getAssignedUserBasedText } from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/card-helpers";
import AvatarStack from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/avatar-stack";
import { getPlatformIcon } from "@/utils/platforms_util";
import { formatDeadline } from "@/utils/date_util";
import RatingSummaryStars from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/rating/rating-summary-stars";
import { buildCampaignDetailsHref } from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/campaign-list-utils";

export default function CompletedCampaignsList({
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
      emptyTitle={t("noCompletedCampaignsFound")}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 overflow-x-scroll gap-4 xl:gap-8 mt-6 items-start no-scrollbar">
        {campaigns.map((c) => (
          <CompletedCard key={c.id} c={c} />
        ))}
      </div>
    </ListShell>
  );
}


function CompletedCard({ c }: { c: CampaignOverView }) {
  const t = useTranslations("brand.CampaignsPage");

  const rating = Math.max(0, Math.min(5, Number(c.rating ?? 0)));

  const campaignType =
    c.campaignType === "paid_ad" ? t("paidAd") : t("influencerPromotion");

  const isAssigned = (c.assignedTo?.length ?? 0) > 0;
  const assignText = getAssignedUserBasedText(isAssigned, c.campaignType);

  return (
    <Card className="py-8">
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-Primary font-semibold leading-tight">
            {c.campaignName}
          </h3>
          <p className="text-dark-gray text-xs">{campaignType}</p>
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

        <div className="rounded-xl border bg-muted/30 px-4 py-4 space-y-1">
          <p className="text-Primary">{t("offered")}</p>
          <p className="text-light-green text-3xl font-semibold">
            ৳ {c.totalBudget}
          </p>
        </div>

        <div className="flex items-center justify-between text-orange text-sm">
          <p>{t("completedOn")}</p>
          <p>{formatDeadline(c.deadline)}</p>
        </div>

        <div className="mt-2 flex items-center justify-center">
          <RatingSummaryStars
            active={rating}
            size="h-10 w-10 md:h-12 md:w-12"
          />
        </div>

        <Link
          href={buildCampaignDetailsHref(c)}
          className="flex w-full items-center justify-center rounded-md border border-light-gray bg-[#F8F8F8] px-2 py-2 text-sm font-medium text-Primary transition-all duration-200 active:scale-[0.98]"
        >
          {t("viewCampaignDetails")}
        </Link>
      </CardContent>
    </Card>
  );
}
