import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { FiInstagram } from "react-icons/fi";
import {
  FaYoutube,
  FaTiktok,
  FaClapperboard,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa6";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { useFormStore } from "@/app/[locale]/(brand)/brand/zustand-store/campaign-forms-store";

const PlacementConfirmCard = () => {
  const toggleOpen = useCampaignStore((s) => s.toggleOpen);
  const { stepOne, stepFour } = useFormStore();

  // Format budget with commas
  const formatBudget = (amount: number) => {
    return amount ? `৳${amount.toLocaleString("en-US")}` : "৳0";
  };

  // Get unique platforms from milestones
  const getUniquePlatforms = () => {
    const platforms = stepFour.milestones.map(
      (milestone) => milestone.platform
    );
    return [...new Set(platforms)];
  };

  const uniquePlatforms = getUniquePlatforms();

  // Function to get icon for each platform
  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();

    switch (platformLower) {
      case "instagram":
        return <FiInstagram className="h-5 w-5 text-white" />;
      case "youtube":
        return <FaYoutube className="h-5 w-5 text-white" />;
      case "tiktok":
        return <FaTiktok className="h-5 w-5 text-white" />;
      case "facebook":
        return <FaFacebookF className="h-5 w-5 text-white" />;
      case "twitter":
        return <FaTwitter className="h-5 w-5 text-white" />;
      case "linkedin":
        return <FaLinkedin className="h-5 w-5 text-white" />;
      default:
        return <FiInstagram className="h-5 w-5 text-white" />; // Default icon
    }
  };

  return (
    <Card className="relative w-[390px] border bg-white rounded-2xl shadow-xl p-6">
      {/* Close */}
      <button
        type="button"
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-Primary/70 hover:bg-light-green/30 hover:text-Primary transition"
        onClick={() => toggleOpen()}
      >
        <X className="h-5 w-5" />
      </button>

      {/* Top icon */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-light-green">
          <Check className="h-8 w-8 text-white" />
        </div>

        <h2 className="text-xl font-semibold leading-tight text-Primary">
          Campaign Placement
          <br />
          Confirmed
        </h2>

        <p className="text-sm leading-6 text-light-green">
          We Will Review Your Campaign Soon.
          <br />
          It May Take Upto 3-5 Business Days
        </p>
      </div>

      {/* Summary box */}
      <div className="rounded-2xl bg-linear-to-r from-Primary to-light-green p-3 text-white">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <FaClapperboard className="h-5 w-5 text-white" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-white/90">
              {stepOne.campaignName || "Summer Fashion Campaign"}
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight">
              {formatBudget(stepFour.totalWithVAT || stepFour.budget || 0)}
            </p>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-white/25" />

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white/90">Platforms</span>

          <div className="flex items-center gap-3">
            {uniquePlatforms.length > 0 ? (
              uniquePlatforms.slice(0, 3).map((platform, index) => (
                <span
                  key={index}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"
                  title={platform}
                >
                  {getPlatformIcon(platform)}
                </span>
              ))
            ) : (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <FiInstagram className="h-5 w-5 text-white" />
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PlacementConfirmCard;
