import AssetsCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/assets-card";
import CampaignMilestone from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/campaign-milestone";
import DeadlineCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/deadline-card";
import ReviewInfoCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/review-info-card";
import TermsAndConditionCard from "@/app/[locale]/(brand)/brand/_components/terms-and-condition-card";

const ReviewCampaign = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-start gap-4">
        <ReviewInfoCard />
        <DeadlineCard />
      </div>

      {/* content assests area */}
      <AssetsCard />

      {/* terms and condition */}
      <TermsAndConditionCard />

      {/* campaign miles stone */}
      <CampaignMilestone />
    </div>
  );
};

export default ReviewCampaign;
