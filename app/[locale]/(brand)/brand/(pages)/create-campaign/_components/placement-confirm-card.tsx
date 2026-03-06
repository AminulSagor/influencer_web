import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { FiInstagram } from "react-icons/fi";
import { FaClapperboard } from "react-icons/fa6";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import type {
  Campaignservice,
  SocialPlatform,
} from "@/app/[locale]/(brand)/brand/types/client-types";
import { getPlatformIcon } from "@/utils/platforms_util";
//import { getPlatformIcon } from "@/helpers/platforms";

type Props = {
  campaign: Campaignservice | null;
};

const PlacementConfirmCard = ({ campaign }: Props) => {
  const toggleOpen = useCampaignStore((s) => s.toggleOpen);

  const formatBudget = (amount: string | null | undefined) => {
    const n = Number(amount ?? 0);
    if (Number.isNaN(n)) return "৳0";
    return `৳${n.toLocaleString("en-US")}`;
  };

  const uniquePlatforms: SocialPlatform[] = Array.from(
    new Set(
      [
        ...(campaign?.client?.platform ?? []),
        ...(campaign?.milestones?.map((m) => m.platform) ?? []),
      ].map((p) => p.toLowerCase())
    )
  );

  const campaignName = campaign?.campaignName || "Summer Fashion Campaign";
  const budget = campaign?.totalBudget ?? campaign?.baseBudget ?? "0";

  return (
    <Card className="relative w-[390px] border bg-white rounded-2xl shadow-xl p-6">
      <button
        type="button"
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-Primary/70 hover:bg-light-green/30 hover:text-Primary transition"
        onClick={toggleOpen}
      >
        <X className="h-5 w-5" />
      </button>

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

      <div className="rounded-2xl bg-linear-to-r from-Primary to-light-green p-3 text-white">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <FaClapperboard className="h-5 w-5 text-white" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-white/90">{campaignName}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">
              {formatBudget(budget)}
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
                  key={`${platform}-${index}`}
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
