"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Droplet, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  formatCurrencyBDT,
  formatDateTimeLabel,
} from "../_utils/analytics-formatters";
import { ClientAnalyticsHighlights } from "@/types/client/analytics/analytics";

type Props = {
  highlights: ClientAnalyticsHighlights | null | undefined;
};

export default function AnalyticsHighlightCards({ highlights }: Props) {
  const t = useTranslations("brand.analytics");
  const locale = useLocale();

  const topCampaign = highlights?.topCampaign;
  const topInfluencer = highlights?.topInfluencer;

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Card className="w-full border-none bg-linear-to-r from-Primary/90 to-light-green text-white">
        <CardContent>
          <div className="flex justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-sm">{t("topCampaign")}</h3>
              <h1 className="mt-1 truncate text-xl font-semibold text-white lg:text-3xl">
                {topCampaign?.title || t("notAvailable")}
              </h1>
              <p className="mt-2 text-xs text-white/85">
                {topCampaign?.budget != null
                  ? formatCurrencyBDT(topCampaign.budget)
                  : t("budgetUnavailable")}
              </p>
              <p className="mt-1 text-xs text-white/80">
                {topCampaign?.date
                  ? formatDateTimeLabel(topCampaign.date, locale)
                  : t("dateUnavailable")}
              </p>
            </div>

            <span className="shrink-0">
              <Droplet size={32} />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full border-none bg-linear-to-r from-Primary/90 to-light-green text-white">
        <CardContent>
          <div className="flex justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-sm">{t("topInfluencer")}</h3>
              <h1 className="mt-1 truncate text-xl font-semibold text-white lg:text-3xl">
                {topInfluencer?.name || t("notAvailable")}
              </h1>
              <p className="mt-2 text-xs text-white/85">
                {topInfluencer
                  ? t("jobsCompleted", { count: topInfluencer.completedJobs })
                  : t("noInfluencerData")}
              </p>
            </div>

            <span className="shrink-0">
              <UserRound size={32} />
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
