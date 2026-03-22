"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCampaignRateableEntities } from "./rating-card.utils";
import RatingSummaryStars from "./rating-summary-stars";
import RatingDialog from "./rating-dialog";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";
import { useTranslations } from "next-intl";

type RatingCardProps = {
  campaign: ClientCampaignDetails;
  title?: string;
  buttonText?: string;
};

export default function RatingCard({
  campaign,
  title,
  buttonText,
}: RatingCardProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("brand.CampaignDetailsPage");

  const entities = React.useMemo(
    () => getCampaignRateableEntities(campaign),
    [campaign],
  );

  const hasEntities = entities.length > 0;
  const isCompleted = campaign.status === "completed";
  const canRate = isCompleted && hasEntities;

  const summaryActive =
    campaign.isRated && Number(campaign.rating) > 0
      ? Number(campaign.rating)
      : 0;

  return (
    <>
      <Card>
        <CardContent>
          <h3 className="text-base font-semibold text-Primary">
            {title ?? t("ratingCard.title")}
          </h3>

          <div className="mt-8 flex flex-col items-center justify-center">
            <RatingSummaryStars active={summaryActive} />

            <Button
              type="button"
              disabled={!canRate}
              onClick={() => setOpen(true)}
              className="mt-10 h-10 w-full max-w-[520px] rounded-[12px] bg-[#81A35A] text-sm font-medium text-white hover:bg-[#73944e] disabled:bg-[#B7B7B7] disabled:text-white"
            >
              {buttonText ?? t("ratingCard.buttonText")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <RatingDialog
        open={open}
        onOpenChange={setOpen}
        campaign={campaign}
        title={title ?? t("ratingCard.title")}
      />
    </>
  );
}
