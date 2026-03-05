import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  FaMusic,
  FaYoutube,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";
import type { Campaignservice, SocialPlatform } from "@/app/[locale]/(brand)/brand/types/client-types";

type Props = {
  campaign: Campaignservice | null;
};

const ReviewInfoCard = ({ campaign }: Props) => {
  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();

    switch (platformLower) {
      case "instagram":
        return <FiInstagram size={16} />;
      case "youtube":
        return <FaYoutube size={16} />;
      case "tiktok":
        return <FaMusic size={16} />;
      case "facebook":
        return <FaFacebookF size={16} />;
      case "twitter":
        return <FaTwitter size={16} />;
      case "linkedin":
        return <FaLinkedin size={16} />;
      default:
        return null;
    }
  };

  const platformsFromClient: SocialPlatform[] = Array.isArray(campaign?.client?.platform)
    ? campaign!.client.platform
    : [];

  const platformsFromMilestones: SocialPlatform[] = Array.isArray(campaign?.milestones)
    ? campaign!.milestones.map((m) => m.platform).filter(Boolean)
    : [];

  const uniquePlatforms = Array.from(
    new Set([...platformsFromClient, ...platformsFromMilestones].map((p) => p.toLowerCase()))
  );

  const totalBudget = campaign?.totalBudget ?? campaign?.baseBudget ?? "0";

  const brandName = campaign?.client?.brandName ?? "StyleCo.";
  const profileImg = campaign?.client?.profileImg || "/avatar/avatar.png";

  return (
    <Card>
      <CardContent className="space-y-3">
        <h1 className="text-Primary font-semibold text-lg">
          {campaign?.campaignName || "Campaign Name"}
        </h1>

        <div className="bg-linear-to-r from-Secondary to-white border-light-green text-light-green rounded-lg border p-4">
          <h3 className="text-xs text-Primary">Your Campaign Budget</h3>
          <h1 className="text-2xl font-semibold">৳ {totalBudget}</h1>
        </div>

        <div className="flex gap-2 items-center">
          <Image
            src={profileImg}
            height={26}
            width={26}
            alt="profile-image"
            className="rounded-full"
          />
          <h2 className="text-orange">{brandName}</h2>
        </div>

        <div className="flex gap-10 items-center">
          <p className="text-dark-gray text-sm">Platforms</p>
          <div className="flex items-center gap-2">
            {uniquePlatforms.length > 0 ? (
              uniquePlatforms.map((platform, index) => {
                const icon = getPlatformIcon(platform);
                return icon ? (
                  <span
                    key={`${platform}-${index}`}
                    className="p-1 rounded-sm bg-light-green text-white"
                    title={platform}
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
