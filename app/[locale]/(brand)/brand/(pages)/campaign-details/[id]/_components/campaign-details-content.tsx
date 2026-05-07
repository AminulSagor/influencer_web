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
import type { AgencyRatingFallback } from "./rating/rating-card.types";

type CampaignDetailsContentProps = {
  campaign: ClientCampaignDetails;
};

const isDeclinedAssignedInfluencer = (status?: string | null) => {
  const value = String(status ?? "")
    .trim()
    .toLowerCase();

  return ["decline", "declined", "rejected", "reject"].includes(value);
};

export default function CampaignDetailsContent({
  campaign,
}: CampaignDetailsContentProps) {
  const t = useTranslations("brand.CampaignDetailsPage");

  const isInfluencerPromotion =
    campaign.campaignType === "influencer_promotion";

  const [agencyRatingFallback, setAgencyRatingFallback] =
    React.useState<AgencyRatingFallback | undefined>(undefined);

  React.useEffect(() => {
    if (campaign.campaignType !== "paid_ad" || typeof window === "undefined") {
      setAgencyRatingFallback(undefined);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const name = params.get("agencyName")?.trim() ?? "";
    const image = params.get("agencyImage")?.trim() ?? "";

    setAgencyRatingFallback(
      name || image
        ? {
            name: name || null,
            image: image || null,
          }
        : undefined,
    );
  }, [campaign.campaignType, campaign.id]);

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

  const selectableAssignedInfluencers = React.useMemo(
    () =>
      assignedInfluencers.filter(
        (influencer) => !isDeclinedAssignedInfluencer(influencer.status),
      ),
    [assignedInfluencers],
  );

  const hasAssignedInfluencers =
    isInfluencerPromotion && assignedInfluencers.length > 0;

  const showShippingAddress =
    hasAssignedInfluencers && campaign.needSampleProduct === true;

  const [selectedInfluencerId, setSelectedInfluencerId] = React.useState("");

  React.useEffect(() => {
    if (!hasAssignedInfluencers) {
      setSelectedInfluencerId("");
      return;
    }

    const hasCurrentInfluencer = selectableAssignedInfluencers.some(
      (influencer) => influencer.influencerId === selectedInfluencerId,
    );

    if (!hasCurrentInfluencer) {
      setSelectedInfluencerId(
        selectableAssignedInfluencers[0]?.influencerId ?? "",
      );
    }
  }, [
    hasAssignedInfluencers,
    selectableAssignedInfluencers,
    selectedInfluencerId,
  ]);

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
            agencyFallback={agencyRatingFallback}
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
