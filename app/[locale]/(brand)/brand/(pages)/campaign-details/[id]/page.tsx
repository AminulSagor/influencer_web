import AssetsCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/assets.card";
import CampaignMilestonesSection from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/campaign-milestones-section";
import CampaignProgressCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/campaign-progress-card";
import CampaignSummaryCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/campaign-summary-card";
import QuoteDetailsCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/quote-details-card";
import RatingCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/rating-card";
import TermsAndConditionCard from "@/app/[locale]/(brand)/brand/_components/terms-and-condition-card";
import { getCampaignDetails } from "@/service/client/campaigns/campaign-details";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function page({ params }: PageProps) {
  const { id } = await params;

  //service
  const campaign = await getCampaignDetails(id);

  if (!campaign) {
    return (
      <div className="p-6 rounded-xl bg-white border border-light-gray">
        <p className="text-sm text-black/70">Campaign not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CampaignSummaryCard campaign={campaign} />
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <div className="lg:col-span-3">
          <QuoteDetailsCard campaign={campaign} />
        </div>
        <div className="lg:col-span-4">
          <RatingCard
            title="Rate The Agency"
            buttonText="Provide Ratings To Influencers"
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
