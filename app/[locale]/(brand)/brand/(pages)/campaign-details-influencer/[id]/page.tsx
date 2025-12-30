import AssetsCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/assets.card";
import CampaignMilestones from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/campaign-milestones";
import CampaignProgressCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/campaign-progress-card";
import CampaignSummaryCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/campaign-summary-card";
import QuoteDetailsCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/quote-details-card";
import RatingCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details-influencer/[id]/_components/rating-card";
import TermsAndConditionCard from "@/app/[locale]/(brand)/brand/_components/terms-and-condition-card";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  console.log(id);
  return (
    <div className="space-y-4">
      <CampaignSummaryCard />
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <div className="lg:col-span-3">
          <QuoteDetailsCard pending={false} />
        </div>
        <div className="lg:col-span-4">
          <RatingCard />
        </div>
      </div>

      {/* campaign progress */}
      <CampaignProgressCard />

      {/* assets */}
      <AssetsCard />

      {/* terms and condition */}
      <TermsAndConditionCard />

      {/* milestones content / area */}
      <CampaignMilestones />
    </div>
  );
};

export default page;
