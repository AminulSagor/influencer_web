import { redirect } from "next/navigation";
import { getCachedCampaignDetails } from "./_lib/get-campaign-details";
import { getDefaultCampaignTab } from "./_lib/campaign-status";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale, id } = await params;
  const campaign = await getCachedCampaignDetails(id);

  if (!campaign) {
    return (
      <div className="rounded-xl border border-light-gray bg-white p-6">
        <p className="text-base text-black/70 text-center">
          Campaign not found Reload Again.
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
