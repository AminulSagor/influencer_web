import { redirect } from "next/navigation";
import { getDefaultCampaignTab } from "./_lib/campaign-status";
import { getCampaignDetails } from "@/service/client/campaigns/campaign-details";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale, id } = await params;
  const campaign = await getCampaignDetails(id);

  if (!campaign) {
    return (
      <div className="rounded-xl border border-light-gray bg-white p-6">
        <p className="text-center text-base text-black/70">
          Campaign not found. Reload again.
        </p>
      </div>
    );
  }

  const targetTab = getDefaultCampaignTab(
    campaign.campaignType,
    campaign.status,
  );

  redirect(`/${locale}/brand/campaign-details/${id}/${targetTab}`);
}
