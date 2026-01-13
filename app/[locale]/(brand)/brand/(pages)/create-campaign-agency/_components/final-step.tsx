"use client";

import { useEffect, useState } from "react";
import BrandAssetsCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/brand-assets-card";
import CampaignMilestones from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/campaign-milestones";
import ContentAssetsCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/content-assets-card";
import DeadlineCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/deadline-card";
import ReviewInfoCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/review-info-card";
import TermsAndConditionCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/terms-and-condition";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { Card, CardContent } from "@/components/ui/card";
import { useToken } from "@/hooks/useGetToken";
import axiosInstance from "@/lib/axios";
import {
  ApiResponse,
  CampaignApi,
} from "@/app/[locale]/(brand)/brand/types/client-types";
import { notifyError } from "@/helpers/helper";
import Loader from "@/components/spin-loader";
import PlacementConfirmCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/placement-confirm-card";
import axios from "axios";

const FinalStep = () => {
  const { open, toggleOpen } = useCampaignStore();
  const decreaseStep = useCampaignStore((s) => s.decreaseStep);
  const campaignId = useCampaignStore((s) => s.campaignId);
  const campaignType = useCampaignStore((s) => s.campaignType);
  const [laoding, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const { token } = useToken();

  const [campaign, setCampaign] = useState<CampaignApi | null>(null);

  useEffect(() => {
    (async () => {
      if (!token || !campaignId) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get<ApiResponse<CampaignApi>>(
          `/campaign/${campaignId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) setCampaign(res.data.data);
      } catch (error: unknown) {
        if (error) {
          notifyError("Something went wrong,");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [token, campaignId]);

  if (laoding) {
    return (
      <div className="flex items-center justify-center mt-10 min-h-44">
        <Loader className="w-15 h-15" />
      </div>
    );
  }

  const handlePlacement = async () => {
    setLoading2(true);
    try {
      const response = await axiosInstance.post(
        `/campaign/${campaignId}/place`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toggleOpen();
      } else {
        notifyError(response.data.message || "Placement failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // More detailed error handling
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to place campaign";
        notifyError(errorMessage);
        console.error("Placement error:", error.response?.data);
      } else {
        notifyError("An unexpected error occurred");
      }
    } finally {
      setLoading2(false);
    }
  };

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
            >
              {loading2 ? <Loader /> : "Get Quote"}
            </PrimaryButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalStep;
