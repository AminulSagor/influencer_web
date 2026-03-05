import { Card, CardContent } from "@/components/ui/card";
import CampaignBrief from "./campaign-brief";
import TermsAndConditions from "./terms-and-conditions";

type Milestone = {
  id: string;
  contentTitle: string;
  contentQuantity: string;
};

export default function CampaignTermsCard({
  campaignGoals,
  productServiceDetails,
  reportingRequirements,
  usageRights,
  needSampleProduct,
  milestones,
}: {
  campaignGoals: string;
  productServiceDetails: string;
  reportingRequirements: string;
  usageRights: string;
  needSampleProduct: boolean;
  milestones: Milestone[];
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start">
          <CampaignBrief
            campaignGoals={campaignGoals}
            productServiceDetails={productServiceDetails}
            needSampleProduct={needSampleProduct}
            milestones={milestones}
          />
          <TermsAndConditions
            reportingRequirements={reportingRequirements}
            usageRights={usageRights}
          />
        </div>
      </CardContent>
    </Card>
  );
}