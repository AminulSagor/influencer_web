import React from "react";
import CampaignDetailsCard from "../_components/campaign-details-card";
import { PiInstagramLogoFill, PiYoutubeLogoFill } from "react-icons/pi";
import { AiFillTikTok } from "react-icons/ai";

const platform = [
  {
    name: "Instagram",
    url: "https://instagram.com",
    icon: () => (
      <>
        <PiInstagramLogoFill size={30} />
      </>
    ),
  },
  {
    name: "Youtube",
    url: "https://youtube.com",
    icon: () => (
      <>
        <PiYoutubeLogoFill size={32} />
      </>
    ),
  },
  {
    name: "Tiktok",
    url: "https://tiktok.com",
    icon: () => (
      <>
        <AiFillTikTok size={32} />
      </>
    ),
  },
];

const page = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <CampaignDetailsCard
            title={"Summer Fashion Campaign"}
            description={"Influencer Promotion"}
            status={"Need Quote"}
            niche="Fashion"
            platform={platform}
            clientAvatar="/abatar2.png"
            clientName="StyleCo."
            startDate="2025-12-15"
            endDate="2025-12-20"
            influencers={[
              { imageUrl: "/", name: "Hania Amir" },
              { imageUrl: "/", name: "Hania Amir" },
              { imageUrl: "/", name: "Hania Amir" },
            ]}
          />
        </div>
        <div className="col-span-12 md:col-span-6"></div>
      </div>
    </div>
  );
};

export default page;
