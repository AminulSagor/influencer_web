"use client";

import { useState, useEffect } from "react";
import BrandAssetsCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-six/brand-assets-card";
import CampaignMilestones from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-six/campaign-milestones";
import ContentAssetsCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-six/content-assets-card";
import DeadlineCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-six/deadline-card";
import ReviewInfoCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-six/review-info-card";
import TermsAndConditionCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-six/terms-and-condition";
import PlacementConfirmCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-six/placement-confirm-card";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/spin-loader";
import { notifyError } from "@/utils/toast_util";
import { getCampaignById } from "@/service/campaign/getById";
import { placeCampaign } from "@/service/campaign/place-campaign";
import { Campaignservice } from "@/types/client/campaigns/create-campaign-types";
import { useTranslations } from "next-intl";

const FinalStep = () => {
  const t = useTranslations("brand.CreateCampaignsPage");

  const { open, toggleOpen, decreaseStep, campaignId, campaignType } =
    useCampaignStore();

  const [placementLoading, setPlacementLoading] = useState(false);
  const [campaign, setCampaign] = useState<Campaignservice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaced, setIsPlaced] = useState(false);

  useEffect(() => {
    if (!campaignId) return;

    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const res = await getCampaignById(campaignId);
        const fetchedCampaign = res.data as unknown as Campaignservice;

        setCampaign(fetchedCampaign);
        setIsPlaced(fetchedCampaign?.status === "received");
      } catch (err: any) {
        notifyError(err.message || t("failedToFetchCampaign"));
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId, t]);

  const handlePlacement = async () => {
    if (!campaignId || isPlaced) return;

    setPlacementLoading(true);
    try {
      const res = await placeCampaign(campaignId);

      if (res.success) {
        setIsPlaced(true);
        toggleOpen();
      } else {
        notifyError(res.message || t("placementFailed"));
      }
    } catch (err: any) {
      notifyError(err.message || t("failedToPlaceCampaign"));
    } finally {
      setPlacementLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      {open && (
        <div className="absolute top-28 right-1/2 z-50 translate-x-1/2">
          <PlacementConfirmCard campaign={campaign} />
        </div>
      )}

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">
        <ReviewInfoCard campaign={campaign} />
        <DeadlineCard campaign={campaign} />
      </div>

      <div className="flex w-full flex-col gap-4 md:flex-row">
        <ContentAssetsCard campaign={campaign} />
        {campaignType === "paid_ad" && <BrandAssetsCard campaign={campaign} />}
      </div>

      <TermsAndConditionCard campaign={campaign} />
      <CampaignMilestones campaign={campaign} />

      <Card>
        <CardContent>
          <div className="flex w-full gap-4 lg:justify-center">
            <SecondaryButton className="w-full" onClick={decreaseStep}>
              {t("previous")}
            </SecondaryButton>
            <PrimaryButton
              className="flex w-full items-center justify-center"
              onClick={handlePlacement}
              disabled={placementLoading || isPlaced}
            >
              {placementLoading ? (
                <Loader />
              ) : isPlaced ? (
                t("quoteRequested")
              ) : (
                t("getQuote")
              )}
            </PrimaryButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalStep;