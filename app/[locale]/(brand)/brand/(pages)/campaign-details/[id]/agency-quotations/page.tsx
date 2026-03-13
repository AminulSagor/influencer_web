import { redirect } from "next/navigation";
import { shouldShowAgencyQuotationTabs } from "../_lib/campaign-status";
import { getCampaignDetails } from "@/service/client/campaigns/campaign-details";
import AgencyQuotationsSection from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/agency-quotations/_components/agency-quotations-section";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function AgencyQuotationsPage({ params }: PageProps) {
  const { locale, id } = await params;
  const campaign = await getCampaignDetails(id);

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
