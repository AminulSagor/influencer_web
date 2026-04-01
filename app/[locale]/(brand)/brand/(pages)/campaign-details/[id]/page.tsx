"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDefaultCampaignTab } from "./_lib/campaign-status";
import { useCampaignDetails } from "./_components/campaign-details-provider";

export default function Page() {
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as string;
  const id = params.id as string;

  const { campaign } = useCampaignDetails();

  useEffect(() => {
    const targetTab = getDefaultCampaignTab(
      campaign.campaignType,
      campaign.status,
    );

    router.replace(`/${locale}/brand/campaign-details/${id}/${targetTab}`);
  }, [router, locale, id, campaign]);

  return null;
}
