import CampaignDetailsCard from "../_components/campaign-details-card";
import CampaignStepper from "../_components/campaign-stepper";
import CampaignQuoteDetails from "../_components/campaing-quote-details";
import PlatformProfit from "../_components/platform-profit";

const platform = [
  { name: "Instagram", url: "https://instagram.com", key: "instagram" },
  { name: "Youtube", url: "https://youtube.com", key: "youtube" },
  { name: "Tiktok", url: "https://tiktok.com", key: "tiktok" },
];

const influencers = [
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
      {/* 3rd row */}
      <div>
        <PlatformProfit campaignStatus="active" stats={stats} />
      </div>
    </div>
  );
};

export default page;
