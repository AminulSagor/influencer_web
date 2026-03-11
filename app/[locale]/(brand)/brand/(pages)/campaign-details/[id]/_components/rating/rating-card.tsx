"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CampaignDetails } from "@/types/client/campaigns/campaign-details";
import { getCampaignRateableEntities } from "./rating-card.utils";
import RatingSummaryStars from "./rating-summary-stars";
import RatingDialog from "./rating-dialog";

type RatingCardProps = {
  campaign: CampaignDetails;
  title?: string;
  buttonText?: string;
};

export default function RatingCard({
  campaign,
  title = "Rate The Influencers",
  buttonText = "Provide Ratings To Influencers",
}: RatingCardProps) {
  const [open, setOpen] = React.useState(false);

  const entities = React.useMemo(
    () => getCampaignRateableEntities(campaign),
    [campaign]
  );

  const hasEntities = entities.length > 0;
  const summaryActive =
    campaign.isRated && Number(campaign.rating) > 0 ? Number(campaign.rating) : 0;

  return (
    <>
      <Card>
        <CardContent>
          <h3 className="text-base font-semibold text-Primary">
            {title}
          </h3>

          <div className="mt-8 flex flex-col items-center justify-center">
            <RatingSummaryStars active={summaryActive} />

            <Button
              type="button"
              disabled={!hasEntities}
              onClick={() => setOpen(true)}
              className="mt-10 h-10 w-full max-w-[520px] rounded-[12px] bg-[#81A35A] text-[16px] font-medium text-white hover:bg-[#73944e] disabled:bg-[#B7B7B7] disabled:text-white"
            >
              {buttonText}
            </Button>
          </div>
        </CardContent>
      </Card>

      <RatingDialog
        open={open}
        onOpenChange={setOpen}
        campaign={campaign}
        title={title}
      />
    </>
  );
}