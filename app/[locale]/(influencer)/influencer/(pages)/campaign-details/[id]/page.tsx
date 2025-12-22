import { Card } from "@/components/ui/card";
import CampaignDetailsCard from "../_components/campaign-details-card";
import DeadlineCard from "../_components/deadline-card";
import ContentAssetCard from "../_components/content-asset-card";

import DeloveryLocation from "@/app/[locale]/(influencer)/influencer/campaign-details/_components/delovery-location";
import CampaignBriefCard from "@/app/[locale]/(influencer)/influencer/campaign-details/_components/campaign-brief-card";
import PaymentMilestones from "@/app/[locale]/(influencer)/influencer/campaign-details/_components/payment-milestone";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div className="p-4 space-y-4">
      {/* campaign details, deadline and offered amount */}
      <div className="grid md:grid-cols-2 gap-4">
        <CampaignDetailsCard />
        <div className="space-y-1.5">
          <DeadlineCard />
          <Card className=" border-light-gray rounded-lg p-4 shadow-md">
            <h2 className="text-Primary font-semibold ">Offered</h2>
            <h1 className="text-light-green text-2xl md:w-3xl font-semibold">
              ৳ 11,000
            </h1>
          </Card>
        </div>
      </div>

      {/* assets and delivery location */}
      <div className="sm:grid grid-cols-12 gap-4 space-y-2">
        <div className="col-span-8">
          <ContentAssetCard />
        </div>
        <div className=" col-span-4">
          <DeloveryLocation />
        </div>
      </div>

      {/* campaign brief and terms & conditions */}
      <CampaignBriefCard />

      <div className="mt-6">
        <PaymentMilestones />
      </div>
    </div>
  );
};

export default page;
