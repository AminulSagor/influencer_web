import CampaignSummaryCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/summary-card/campaign-summary-card";
import CampaignDetailsTabs from "./_components/campaign-details-tabs";
import { shouldShowAgencyQuotationTabs } from "./_lib/campaign-status";
import { getCampaignDetails } from "@/service/client/campaigns/campaign-details";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
};

export default async function Layout({ children, params }: LayoutProps) {
  const { id } = await params;
  const campaign = await getCampaignDetails(id);

  if (!campaign) {
    return (
      <div className="rounded-xl border border-light-gray bg-white p-6">
        <p className="text-sm text-black/70">Please reload again.</p>
      </div>
    );
  }

  const showTabs = shouldShowAgencyQuotationTabs(
    campaign.campaignType,
    campaign.status,
  );

  return (
    <div className="space-y-4">
      <CampaignSummaryCard campaign={campaign} />
      {showTabs ? <CampaignDetailsTabs /> : null}
      {children}
    </div>
  );
}
