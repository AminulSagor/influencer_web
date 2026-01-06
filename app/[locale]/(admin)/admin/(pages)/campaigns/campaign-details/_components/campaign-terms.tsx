import { Card, CardContent } from "@/components/ui/card";
import CampaignBrief from "./campaign-brief";
import TermsAndConditions from "./terms-and-conditions";

const CampaignTermsCard = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start">
          <CampaignBrief />
          <TermsAndConditions />
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignTermsCard;
