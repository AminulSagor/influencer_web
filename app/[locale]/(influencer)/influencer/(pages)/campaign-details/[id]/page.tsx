import CampaignDetailsCard from "../_components/campaign-details-card";
import DeadlineCard from "../_components/deadline-card";
import ContentAssetCard from "../_components/content-asset-card";
import DeliveryLocation from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/delivery-location";
import CampaignBriefSection from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/campaign-brief-card";
import MilestoneClient from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/[id]/milestone-client";
import OfferedCard from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/offered.card";

const page = async () => {
  const isAccepted = true;
  return (
    <div className="space-y-4">
      {/* campaign details, deadline and offered amount */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/2">
          <CampaignDetailsCard />
        </div>
        <div className="space-y-3 lg:w-1/2">
          <DeadlineCard />
          <OfferedCard/>
        </div>
      </div>

      {/* assets and delivery location */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-3/5">
          <ContentAssetCard />
        </div>
        <div className="lg:w-2/5">
          <DeliveryLocation />
        </div>
      </div>

      {/* campaign brief and terms & conditions */}
      <CampaignBriefSection />

      {/* milestone area */}
      <MilestoneClient isAccepted={isAccepted} />
    </div>
  );
};  

export default page;
