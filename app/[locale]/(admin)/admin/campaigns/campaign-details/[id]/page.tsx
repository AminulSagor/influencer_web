import CampaignBrief from "../_components/campaign-brief";
import CampaignDetailsCard from "../_components/campaign-details-card";
import CampaignMilestone from "../_components/campaign-milestone";
import CampaignMilestoneContainer from "../_components/campaign-milestone-container";
import CampaignStepper from "../_components/campaign-stepper";
import CampaignTermsCard from "../_components/campaign-terms";
import CampaignQuoteDetails from "../_components/campaing-quote-details";
import ContentAssetCard from "../_components/content-asset-card";
import InfluencerPaymentMethod from "../_components/influencer-payment-method";
import InfluencerRatingCard from "../_components/influencer-rating-card";
import PlatformProfit from "../_components/platform-profit";

export type InvitationStatusType = "sent" | "accepted";
export type CampaignStatusType =
  | "needs-quote"
  | "pending-invitations"
  | "active"
  | "completed"
  | "paid";
export type Influencer = {
  imageUrl: string;
  name: string;
};

const platform = [
  { name: "Instagram", url: "https://instagram.com", key: "instagram" },
  { name: "Youtube", url: "https://youtube.com", key: "youtube" },
  { name: "Tiktok", url: "https://tiktok.com", key: "tiktok" },
];

const influencers: Influencer[] = [
  { imageUrl: "/", name: "Hania Amir" },
  { imageUrl: "/", name: "Shakib Al Hasan" },
  { imageUrl: "/", name: "Virat Kohli" },
];

const stats = [
  {
    label: "Final Quote Budget",
    value: 0,
  },
  {
    label: "Target Profit / Platform Fee",
    value: 0,
  },
  {
    label: "Available For Influencers",
    value: 0,
  },
];

const page = () => {
  const invitationStatus: InvitationStatusType = "accepted";
  const campaignStatus: CampaignStatusType = "active";
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <CampaignDetailsCard
            platform={platform}
            title={"Summer Fashion Campaign"}
            description={"Influencer Promotion"}
            status={"Need Quote"}
            niche="Fashion"
            clientAvatar="/abatar2.png"
            clientName="StyleCo."
            startDate="2025-12-15"
            endDate="2025-12-20"
            influencers={influencers}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <CampaignQuoteDetails
            revisedCount={0}
            currencySymbol="৳"
            platform={platform}
          />
        </div>
      </div>
      <div>
        <CampaignStepper currentStep={4} />
      </div>
      <div>
        <PlatformProfit
          campaignStatus="active"
          stats={stats}
          invitationStatus={invitationStatus}
        />
      </div>

      {/* when accepted */}
      <div>
        <InfluencerPaymentMethod
          campaignStatus="active"
          invitationStatus={invitationStatus}
        />
      </div>
      <div>
        <CampaignMilestoneContainer
          campaignStatus={campaignStatus}
          invitationStatus={invitationStatus}
          influencers={influencers}
        />
      </div>
      <div>
        <CampaignTermsCard />
      </div>
      <div>
        <ContentAssetCard />
      </div>
      <div>
        <InfluencerRatingCard />
      </div>
    </div>
  );
};

export default page;
