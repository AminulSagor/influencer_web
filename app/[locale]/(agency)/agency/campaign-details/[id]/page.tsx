import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CampaignDetailsCard from "../_components/campaign-details-card";
import RequoteTimeLeftCard from "../_components/requote-time-left-card";
import DeadlineCard from "../_components/deadline-card";
import ContentAssetCard from "../_components/content-asset-card";
import BrandAssetCard from "../_components/brand-asset-card";
import QuoteDetailsCard from "../_components/quote-details-card";

import CampaignBrief from "../_components/campaign-brief";
import TermsAndConditions from "../_components/terms-and-conditions";
import { GiHillFort, GiMountains } from "react-icons/gi";
import { VscMilestone } from "react-icons/vsc";
import PaymentMilestone from "../_components/payment-milestone-card";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div className="p-4 space-y-4">
      {/* 1st row */}
      <div className="grid-cols-12 grid gap-4">
        <div className="col-span-12 sm:col-span-6">
          <CampaignDetailsCard />
        </div>
        <div className="col-span-12 sm:col-span-3">
          <RequoteTimeLeftCard />
        </div>
        <div className="col-span-12 sm:col-span-3">
          <DeadlineCard />
        </div>
      </div>
      {/* 2nd row */}
      <div className="grid-cols-12 grid gap-4">
        <div className="col-span-12 sm:col-span-4">
          <ContentAssetCard />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <BrandAssetCard />
        </div>
        <div className="col-span-12 sm:col-span-4">
          <QuoteDetailsCard />
        </div>
      </div>
      {/* 3rd row */}
      <div>
        <Card>
          <CardContent>
            <div className="flex items-start">
              <CampaignBrief />
              <TermsAndConditions />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* 4th row */}
      <div>
        <PaymentMilestone paid={1} total={4} />
      </div>
    </div>
  );
};

export default page;
