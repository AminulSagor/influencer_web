import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { FiInstagram } from "react-icons/fi";
import { FaClapperboard } from "react-icons/fa6";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import type {
  Campaignservice,
  SocialPlatform,
} from "@/types/client/campaigns/create-campaign-types";
import { getPlatformIcon } from "@/utils/platforms_util";
import { useTranslations } from "next-intl";

type Props = {
  campaign: Campaignservice | null;
  onClose?: () => void;
};

const PlacementConfirmCard = ({ campaign, onClose }: Props) => {
  const t = useTranslations("brand.CreateCampaignsPage");
  const toggleOpen = useCampaignStore((s) => s.toggleOpen);

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    toggleOpen();
  };

  const formatBudget = (amount: string | number | null | undefined) => {
    const n = Number(amount ?? 0);
    if (Number.isNaN(n)) return "৳0";
    return `৳${n.toLocaleString("en-US")}`;
  };

  const uniquePlatforms: SocialPlatform[] = Array.from(
    new Set(
      [
        ...(campaign?.client?.platform ?? []),
        ...(campaign?.milestones?.map((m) => m.platform) ?? []),
      ].map((p) => p.toLowerCase()),
    ),
  );

  const campaignName = campaign?.campaignName || "Summer Fashion Campaign";
  const baseBudget = campaign?.baseBudget ?? campaign?.budget?.baseBudget;
  const totalBudget = campaign?.totalBudget ?? campaign?.budget?.totalBudget;
  const budget = totalBudget ?? baseBudget ?? "0";

  return (
    <Card className="relative w-[390px] rounded-2xl border bg-white p-6 shadow-xl">
      <button
        type="button"
        aria-label={t("close")}
        className="text-Primary/70 hover:bg-light-green/30 hover:text-Primary absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full transition"
        onClick={handleClose}
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="bg-light-green mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Check className="h-8 w-8 text-white" />
        </div>

        <h2 className="text-Primary text-xl font-semibold leading-tight">
          {t("campaignPlacement")}
          <br />
          {t("confirmed")}
        </h2>

        <p className="text-light-green text-sm leading-6">
          {t("weWillReviewYourCampaignSoon")}
          <br />
          {t("itMayTakeUptoBusinessDays")}
        </p>
      </div>

      <div className="from-Primary to-light-green rounded-2xl bg-linear-to-r p-3 text-white">
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
          <span className="text-sm font-medium text-white/90">
            {t("platforms")}
          </span>

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
