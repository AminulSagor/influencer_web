"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { shouldShowAgencyQuotationTabs } from "../_lib/campaign-status";
import { useCampaignDetails } from "../_components/campaign-details-provider";
import AgencyQuotationsSection from "./_components/agency-quotations-section";

export default function AgencyQuotationsPage() {
  const router = useRouter();
  const params = useParams();

  const locale = params.locale as string;
  const id = params.id as string;

  const { campaign } = useCampaignDetails();

  const canAccessAgencyQuotationPage = shouldShowAgencyQuotationTabs(
    campaign.campaignType,
    campaign.status,
  );

  useEffect(() => {
    if (!canAccessAgencyQuotationPage) {
      router.replace(`/${locale}/brand/campaign-details/${id}/details`);
    }
  }, [canAccessAgencyQuotationPage, router, locale, id]);

  if (!canAccessAgencyQuotationPage) {
    return null;
  }

  return <AgencyQuotationsSection campaign={campaign} />;
}
