// page.tsx
import AssetsCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/assets.card";
import CampaignMilestones from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/campaign-milestones";
import CampaignProgressCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/campaign-progress-card";
import CampaignSummaryCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/campaign-summary-card";
import QuoteDetailsCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/quote-details-card";
import RatingCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/rating-card";
import TermsAndConditionCard from "@/app/[locale]/(brand)/brand/_components/terms-and-condition-card";
import { campaignMocksData } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/data";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  const campaign =
    campaignMocksData.find((c) => c.id === id) ?? campaignMocksData[0];

    console.log(campaign)
  return (
    <div className="space-y-4">
      <CampaignSummaryCard campaign={campaign} />

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <div className="lg:col-span-3">
          {/* later you can pass quote from campaign */}
          <QuoteDetailsCard campaign={campaign} />
        </div>
        <div className="lg:col-span-4">
          <RatingCard />
        </div>
      </div>

      <CampaignProgressCard campaign={campaign} />
      <AssetsCard />
      <TermsAndConditionCard />
      <CampaignMilestones campaign={campaign}/>
    </div>
  );
};

export default page;
