import BrandAssetsCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/brand-assets-card";
import CampaignMilestones from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/campaign-milestones";
import ContentAssetsCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/content-assets-card";
import DeadlineCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/deadline-card";
import ReviewInfoCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/review-info-card";
import TermsAndConditionCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/terms-and-condition";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { Card, CardContent } from "@/components/ui/card";

const FinalStep = () => {
  const toggleOpen = useCampaignStore((s) => s.toggleOpen);
  const decreaseStep = useCampaignStore((s) => s.decreaseStep);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-start gap-4">
        <ReviewInfoCard />
        <DeadlineCard />
      </div>

      {/* content assests area */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <ContentAssetsCard />
        <BrandAssetsCard />
      </div>

      {/* terms and condition */}
      <TermsAndConditionCard />

      {/* campaign miles stone */}
      <CampaignMilestones />

      <Card>
        <CardContent>
          <div className="w-full flex gap-4 lg:justify-center">
            <SecondaryButton className="w-full" onClick={() => decreaseStep()}>
              Previous
            </SecondaryButton>
            <PrimaryButton className="w-full" onClick={toggleOpen}>
              Get Quote
            </PrimaryButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalStep;
