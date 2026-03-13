import AssetsCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/assets.card";
import CampaignMilestonesSection from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/campaign-milestones-section";
import CampaignProgressCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/campaign-progress-card";
import QuoteDetailsCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/quote-details-card";
import RatingCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/rating/rating-card";
import TermsAndConditionCard from "@/app/[locale]/(brand)/brand/_components/terms-and-condition-card";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";

type CampaignDetailsContentProps = {
  campaign: ClientCampaignDetails;
};

export default function CampaignDetailsContent({
  campaign,
}: CampaignDetailsContentProps) {
  const isInfluencerPromotion =
    campaign.campaignType === "influencer_promotion";

  const ratingTitle = isInfluencerPromotion
    ? "Rate The Influencers"
    : "Rate The Agency";

  const ratingButtonText = isInfluencerPromotion
    ? "Provide Ratings To Influencers"
    : "Provide Ratings To Agency";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <div className="lg:col-span-3">
          <QuoteDetailsCard campaign={campaign} />
        </div>

        <div className="lg:col-span-4">
          <RatingCard
            campaign={campaign}
            title={ratingTitle}
            buttonText={ratingButtonText}
          />
        </div>
      </div>

      <CampaignProgressCard campaign={campaign} />
      <AssetsCard campaign={campaign} />
      <TermsAndConditionCard campaign={campaign} />
      <CampaignMilestonesSection campaign={campaign} />
    </div>
  );
}
