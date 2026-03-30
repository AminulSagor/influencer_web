"use client";

import CampaignDetailsContent from "../_components/campaign-details-content";
import { useCampaignDetails } from "../_components/campaign-details-provider";

export default function DetailsPage() {
  const { campaign } = useCampaignDetails();

  return <CampaignDetailsContent campaign={campaign} />;
}
