import CampaignDetailsCard from "../_components/campaign-details-card";
import CampaignQuoteDetails from "../_components/campaing-quote-details";

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

const page = () => {
  return (
    <div className="p-4">
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
    </div>
  );
};

export default page;
