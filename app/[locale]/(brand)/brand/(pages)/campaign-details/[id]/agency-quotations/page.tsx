import { redirect } from "next/navigation";
import AgencyQuotationsSection from "../_components/agency-quotations-section";
import { getCachedCampaignDetails } from "../_lib/get-campaign-details";
import { shouldShowAgencyQuotationTabs } from "../_lib/campaign-status";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function AgencyQuotationsPage({ params }: PageProps) {
  const { locale, id } = await params;
  const campaign = await getCachedCampaignDetails(id);

  if (!campaign) {
    return (
      <div className="rounded-xl border border-light-gray bg-white p-6">
        <p className="text-sm text-black/70">Campaign not found.</p>
      </div>
    );
  }

  const canAccessAgencyQuotationPage = shouldShowAgencyQuotationTabs(
    campaign.campaignType,
    campaign.status,
  );

  if (!canAccessAgencyQuotationPage) {
    redirect(`/${locale}/brand/campaign-details/${id}/details`);
  }

  return <AgencyQuotationsSection campaign={campaign} />;
}
