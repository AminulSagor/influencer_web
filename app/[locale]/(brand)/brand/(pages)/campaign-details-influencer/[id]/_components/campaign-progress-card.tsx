import ProgressStepper from "@/app/[locale]/(brand)/brand/_components/progress-stepper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Target } from "lucide-react";
import React from "react";

const CampaignProgressCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-Primary font-semibold">
          <span>
            <Target />
          </span>
          <p>Campaign Progress</p>
        </div>
      </CardHeader>

      <CardContent>
        <ProgressStepper/>
      </CardContent>
    </Card>
  );
};

export default CampaignProgressCard;
