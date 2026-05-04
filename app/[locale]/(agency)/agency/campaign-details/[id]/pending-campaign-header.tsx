"use client";

import { useState } from "react";
import type { AgencyCampaignDetails } from "@/types/agency/job-details";
import CampaignDetailsCard from "../_components/campaign-details-card";
import DeadlineCard from "../_components/deadline-card";
import RequoteTimeLeftCard from "../_components/requote-time-left-card";

interface Props {
  campaign: AgencyCampaignDetails;
  forceQuotedView?: boolean;
}

const PendingCampaignHeader = ({
  campaign,
  forceQuotedView = false,
}: Props) => {
  const [isQuotationSent, setIsQuotationSent] = useState(forceQuotedView);

  return (
    <>
      <div className="col-span-12 h-full sm:col-span-6">
        <CampaignDetailsCard
          isAccepted={false}
          campaign={campaign}
          forceQuotedView={forceQuotedView}
          quotationSent={isQuotationSent}
          onQuotationSentChange={setIsQuotationSent}
        />
      </div>

      {!isQuotationSent ? (
        <div className="col-span-12 sm:col-span-3">
          <RequoteTimeLeftCard
            timeLeftToRequoteMinutes={campaign.timeLeftToRequoteMinutes}
            invitedAt={campaign.invitedAt}
          />
        </div>
      ) : null}

      <div
        className={`col-span-12 ${
          isQuotationSent ? "sm:col-span-6" : "sm:col-span-3"
        }`}
      >
        <DeadlineCard
          startingDate={campaign.startingDate}
          duration={campaign.duration}
        />
      </div>
    </>
  );
};

export default PendingCampaignHeader;
