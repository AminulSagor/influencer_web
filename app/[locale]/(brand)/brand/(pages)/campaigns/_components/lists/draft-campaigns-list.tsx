"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { CampaignOverView } from "@/types/client/campaigns/campaign-overview";
import { Card, CardContent } from "@/components/ui/card";
import { FaClock } from "react-icons/fa";
import ListShell from "../list-shell";

import AvatarStack from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/avatar-stack";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { getPlatformIcon } from "@/utils/platforms_util";
import { formatDeadline } from "@/utils/date_util";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";

export default function DraftCampaignsList({
  campaigns,
  loading,
}: {
  campaigns: CampaignOverView[];
  loading?: boolean;
}) {
  const t = useTranslations("brand.CampaignsPage");

  return (
    <ListShell
      loading={loading}
      empty={!loading && campaigns.length === 0}
      emptyTitle={t("noDraftCampaignsFound")}
    >
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
        {campaigns.map((c) => (
          <div key={c.id}>
            <DraftCard c={c} />
          </div>
        ))}
      </div>
    </ListShell>
  );
}

function DraftCard({ c }: { c: CampaignOverView }) {
  const t = useTranslations("brand.CampaignsPage");
  const router = useRouter();
  const setStep = useCampaignStore((state) => state.setStep);
  const setCampaignId = useCampaignStore((state) => state.setCampaignId);
  const setCampaignType = useCampaignStore((state) => state.setCampaignType);

  const campaignType =
    c.campaignType === "paid_ad" ? t("paidAd") : t("influencerPromotion");

  const isPaidAd = c.campaignType === "paid_ad";
  const isInfluencerCampaign = c.campaignType === "influencer_promotion";
  const isAssigned = (c.assignedTo?.length ?? 0) > 0;

  const safeStep = Math.max(1, Number(c.currentStep) || 1);

  const assignmentText = (() => {
    if (isPaidAd) {
      return isAssigned ? t("agencyAssigned") : t("noAgencyAssigned");
    }

    if (isInfluencerCampaign) {
      return isAssigned ? t("influencerAssigned") : t("noInfluencersAssigned");
    }

    return "";
  })();

  const handleContinueEditing = () => {
    setCampaignId(c.id);
    setCampaignType(c.campaignType);
    setStep(safeStep);

    router.push(`/brand/create-campaign?draftId=${c.id}&step=${safeStep}`);
  };

  return (
    <Card className="py-8">
      <CardContent className="space-y-4 lg:px-3 xl:px-6">
        <div className="space-y-1">
          <h3 className="text-Primary text-lg font-semibold leading-tight">
            {c.campaignName}
          </h3>
          <p className="text-dark-gray text-sm">{campaignType}</p>
        </div>

        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <AvatarStack users={c.assignedTo} />
          {assignmentText}
        </div>

        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">{t("platforms")}</p>
          <div className="flex items-center gap-2">
            {c.platforms.length ? (
              c.platforms.map((p) => (
                <span
                  key={p}
                  className="bg-light-green leading-none rounded-md p-1.5"
                >
                  {getPlatformIcon(p, "h-4 w-4 text-white")}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">
                {t("noPlatformsAdded")}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 rounded-xl border bg-muted/40 px-4 py-5">
          <p className="text-Primary">{t("offered")}</p>
          <p className="text-light-green text-3xl font-semibold">
            {c.totalBudget > 0 ? c.totalBudget : t("none")}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-orange flex items-center gap-2 text-sm">
            <FaClock className="text-orange" />
            {t("deadline")}
          </p>
          <p className="text-orange text-sm">{formatDeadline(c.deadline)}</p>
        </div>

        <SecondaryButton
          className="text-Primary w-full px-2 py-2"
          onClick={handleContinueEditing}
        >
          {t("continueEditingCampaignDetails")}
        </SecondaryButton>
      </CardContent>
    </Card>
  );
}
