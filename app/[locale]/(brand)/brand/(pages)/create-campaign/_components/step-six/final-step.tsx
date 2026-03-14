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

const FinalStep = () => {
  const { open, toggleOpen, decreaseStep, campaignId, campaignType } =
    useCampaignStore();
  const [placementLoading, setPlacementLoading] = useState(false);
  const [campaign, setCampaign] = useState<Campaignservice | null>(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Load campaign from backend when component mounts
  useEffect(() => {
    if (!campaignId) return;

    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const res = await getCampaignById(campaignId);
        setCampaign(res.data as unknown as Campaignservice);
        console.log("Fetched campaign:", res.data);
      } catch (err: any) {
        notifyError(err.message || "Failed to fetch campaign");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  // 2️⃣ Handle campaign placement
  const handlePlacement = async () => {
    if (!campaignId) return;

    setPlacementLoading(true);
    try {
      const res = await placeCampaign(campaignId);
      console.log("Placement service Response:", res);

      if (res.success) {
        const placedCampaign = res.data as unknown as Campaignservice;
        setCampaign(placedCampaign); // Update state to show final placed data
        toggleOpen();
        console.log("Campaign state updated after placement:", placedCampaign);
      } else {
        notifyError(res.message || "Placement failed");
      }
    } catch (err: any) {
      notifyError(err.message || "Failed to place campaign");
      console.error("Placement error:", err);
    } finally {
      setPlacementLoading(false);
    }
  };

  if (loading) return <Loader />; // Show loader while fetching

  return (
    <div className="space-y-4">
      {open && (
        <div className="absolute top-28 right-1/2 translate-x-1/2 z-50">
          <PlacementConfirmCard campaign={campaign} />
        </div>
      )}

      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-start gap-4">
        <ReviewInfoCard campaign={campaign} />
        <DeadlineCard campaign={campaign} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <ContentAssetsCard campaign={campaign} />
        {campaignType === "paid_ad" && <BrandAssetsCard campaign={campaign} />}
      </div>

      <TermsAndConditionCard campaign={campaign} />
      <CampaignMilestones campaign={campaign} />

      <Card>
        <CardContent>
          <div className="w-full flex gap-4 lg:justify-center">
            <SecondaryButton className="w-full" onClick={decreaseStep}>
              Previous
            </SecondaryButton>
            <PrimaryButton
              className="w-full items-center flex justify-center"
              onClick={handlePlacement}
              disabled={placementLoading}
            >
              {placementLoading ? <Loader /> : "Get Quote"}
            </PrimaryButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalStep;
