import React from "react";
import CampaignMilestone from "./campaign-milestone";
import {
  CampaignStatusType,
  Influencer,
  InvitationStatusType,
} from "../[id]/page";
interface Props {
  invitationStatus: InvitationStatusType;
  campaignStatus: CampaignStatusType;
  influencers: Influencer[];
}

const CampaignMilestoneContainer = ({
  invitationStatus,
  campaignStatus,
  influencers,
}: Props) => {
  return (
    <div>
      <CampaignMilestone
        influencers={influencers}
        campaignStatus={campaignStatus}
        invitationStatus={invitationStatus}
      />
    </div>
  );
};

export default CampaignMilestoneContainer;
