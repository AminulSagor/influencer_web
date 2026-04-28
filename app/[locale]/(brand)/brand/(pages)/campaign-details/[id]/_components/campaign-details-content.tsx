"use client";

import * as React from "react";
import AssetsCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/assets.card";
import CampaignMilestonesSection from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/campaign-milestones-section";
import CampaignProgressCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/campaign-progress-card";
import RatingCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/rating/rating-card";
import TermsAndConditionCard from "@/app/[locale]/(brand)/brand/_components/terms-and-condition-card";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";
import QuoteDetailsCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/quote/quote-details-card";
import { useTranslations } from "next-intl";
import ShippingAddressCard from "./shipping-address-card";

type CampaignDetailsContentProps = {
  campaign: ClientCampaignDetails;
};

export default function CampaignDetailsContent({
  campaign,
}: CampaignDetailsContentProps) {
  const t = useTranslations("brand.CampaignDetailsPage");

  const isInfluencerPromotion =
    campaign.campaignType === "influencer_promotion";

  const ratingTitle = isInfluencerPromotion
    ? t("campaignDetailsContent.rateTheInfluencers")
    : t("campaignDetailsContent.rateTheAgency");

  const ratingButtonText = isInfluencerPromotion
    ? t("campaignDetailsContent.provideRatingsToInfluencers")
    : t("campaignDetailsContent.provideRatingsToAgency");

  const assignedInfluencers = React.useMemo(
    () => campaign.assignedInfluencers ?? [],
    [campaign.assignedInfluencers],
  );

  const showShippingAddress =
    isInfluencerPromotion && assignedInfluencers.length > 0;

  const [selectedInfluencerId, setSelectedInfluencerId] = React.useState("");

  React.useEffect(() => {
    if (!showShippingAddress) {
      setSelectedInfluencerId("");
      return;
    }

    const hasCurrentInfluencer = assignedInfluencers.some(
      (influencer) => influencer.influencerId === selectedInfluencerId,
    );

    if (!hasCurrentInfluencer) {
      setSelectedInfluencerId(assignedInfluencers[0]?.influencerId ?? "");
    }
  }, [showShippingAddress, assignedInfluencers, selectedInfluencerId]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:items-stretch">
        <div className="min-h-0 lg:col-span-3 lg:flex">
          <div className="h-full w-full">
            <QuoteDetailsCard campaign={campaign} />
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-2 lg:col-span-4 lg:h-full">
          <RatingCard
            campaign={campaign}
            title={ratingTitle}
            buttonText={ratingButtonText}
            compact={showShippingAddress}
            className={showShippingAddress ? "lg:flex-none" : "lg:flex-1"}
          />

          {showShippingAddress ? (
            <ShippingAddressCard
              campaign={campaign}
              selectedInfluencerId={selectedInfluencerId}
              onSelectInfluencer={setSelectedInfluencerId}
              className="lg:min-h-0 lg:flex-1"
            />
          ) : null}
        </div>
      </div>

      <CampaignProgressCard campaign={campaign} />
      <AssetsCard campaign={campaign} />
      <TermsAndConditionCard campaign={campaign} />
      <CampaignMilestonesSection
        campaign={campaign}
        selectedInfluencerId={selectedInfluencerId}
        onSelectInfluencer={setSelectedInfluencerId}
      />
    </div>
  );
}
