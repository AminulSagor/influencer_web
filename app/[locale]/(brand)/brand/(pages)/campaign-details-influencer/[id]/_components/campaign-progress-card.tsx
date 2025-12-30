import ProgressStepper from "@/app/[locale]/(brand)/brand/_components/progress-stepper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Target } from "lucide-react";
import React from "react";
import { campaignMocksData } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/data";

type CampaignDetails = (typeof campaignMocksData)[number];

type Props = {
  campaign: CampaignDetails;
};

const CampaignProgressCard = ({ campaign }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-Primary font-semibold">
          <Target />
          <p>Campaign Progress</p>
        </div>
      </CardHeader>

      <CardContent>
        <ProgressStepper progressStepper={campaign.progressStepper} />
      </CardContent>
    </Card>
  );
};

export default CampaignProgressCard;
