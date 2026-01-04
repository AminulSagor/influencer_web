import { useFormStore } from "@/app/[locale]/(brand)/brand/zustand-store/campaign-forms-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import {
  FaMusic,
  FaYoutube,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";

const ReviewInfoCard = () => {
  const { stepOne, stepFour } = useFormStore();

  // Function to get icon based on platform text
  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();

    switch (platformLower) {
      case "instagram":
        return <FiInstagram size={22} />;
      case "youtube":
        return <FaYoutube size={22} />;
      case "tiktok":
        return <FaMusic size={22} />;
      case "facebook":
        return <FaFacebookF size={22} />;
      case "twitter":
        return <FaTwitter size={22} />;
      case "linkedin":
        return <FaLinkedin size={22} />;
      default:
        return null;
    }
  };

  // Get unique platforms from all milestones
  const getUniquePlatforms = () => {
    const platforms = stepFour.milestones.map(
      (milestone) => milestone.platform
    );
    return [...new Set(platforms)]; // Remove duplicates
  };

  const uniquePlatforms = getUniquePlatforms();

  return (
    <Card>
      <CardContent className="space-y-3">
        <h1 className="text-Primary font-semibold text-lg">
          {stepOne.campaignName || "Campaign Name"}
        </h1>
        <div className="bg-linear-to-r from-light-green/10 to-white border-light-green text-light-green rounded-lg border p-4">
          <h3 className="text-xs text-Primary">Your Campaign Budget</h3>
          <h1 className="text-2xl font-semibold">৳ {stepFour.budget || "0"}</h1>
        </div>

        <div className="flex gap-2 items-center">
          <Image
            src={"/avatar/avatar.png"}
            height={26}
            width={26}
            alt="profile-image"
            className="rounded-full"
          />
          <h2 className="text-orange">StyleCo.</h2>
        </div>

        <div className="flex gap-10 items-center">
          <p className="text-dark-gray text-sm">Platforms</p>
          <div className="flex items-center gap-2">
            {uniquePlatforms.length > 0 ? (
              uniquePlatforms.map((platform, index) => {
                const icon = getPlatformIcon(platform);
                return icon ? (
                  <span
                    key={index}
                    className="p-1 rounded-sm bg-light-green text-white"
                    title={platform} // Show platform name on hover
                  >
                    {icon}
                  </span>
                ) : null;
              })
            ) : (
              <span className="text-sm">No platforms selected</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewInfoCard;
