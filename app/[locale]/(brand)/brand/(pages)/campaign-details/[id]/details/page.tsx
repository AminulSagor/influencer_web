import CampaignDetailsContent from "../_components/campaign-details-content";
import {
  getCachedCampaignDetails,
  getCachedClientCampaignDetails,
} from "../_lib/get-campaign-details";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function DetailsPage({ params }: PageProps) {
  const { id } = await params;

  const [campaign, clientCampaignDetails] = await Promise.all([
    getCachedCampaignDetails(id),
    getCachedClientCampaignDetails(id),
  ]);

  if (!campaign) {
    return (
      <div className="rounded-xl border border-light-gray bg-white p-6">
        <p className="text-sm text-black/70">Campaign not found.</p>
      </div>
    );
  }

  return (
    <CampaignDetailsContent
      campaign={campaign}
      assignedInfluencers={clientCampaignDetails?.assignedInfluencers ?? []}
    />
  );
}