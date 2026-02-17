"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCampaignById } from "@/api/admin/campaign/get-campaign";

import CampaignDetailsCard from "../campaign-details/_components/campaign-details-card";
import CampaignMilestoneContainer from "../campaign-details/_components/campaign-milestone-container";
import CampaignStepper from "../campaign-details/_components/campaign-stepper";
import CampaignTermsCard from "../campaign-details/_components/campaign-terms";
import CampaignQuoteDetails from "../campaign-details/_components/campaing-quote-details";
import ContentAssetCard from "../campaign-details/_components/content-asset-card";
import InfluencerPaymentMethod from "../campaign-details/_components/influencer-payment-method";
import InfluencerRatingCard from "../campaign-details/_components/influencer-rating-card";
import PlatformProfit from "../campaign-details/_components/platform-profit";

export type InvitationStatusType = "sent" | "accepted";
export type CampaignStatusType =
  | "needs-quote"
  | "pending-invitations"
  | "active"
  | "completed"
  | "paid";

export type Influencer = { imageUrl: string; name: string };

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const campaignId = id;

  const invitationStatus: InvitationStatusType = "sent";
  const campaignStatus: CampaignStatusType = "active";

  const [campaign, setCampaign] = useState<any>(null);

  useEffect(() => {
    if (!campaignId) return;
    (async () => {
      const res = await getCampaignById(campaignId);
      setCampaign(res?.data ?? res);
    })();
  }, [campaignId]);

  if (!campaign) return <div>Loading...</div>;

  // ✅ derived data from API (must be inside component because it uses `campaign`)
  const totalBudget = Number(campaign?.totalBudget ?? 0);
  const availableForInfluencers = Number(campaign?.availableBudgetForExecution ?? 0);
  const platformFee = Math.max(0, totalBudget - availableForInfluencers);

  const platform = Array.from(
    new Set<string>(
      (campaign?.milestones ?? [])
        .map((m: any) => m?.platform)
        .filter((p: any): p is string => typeof p === "string" && p.length > 0)
    )
  ).map((key) => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    url:
      key === "instagram"
        ? "https://instagram.com"
        : key === "youtube"
          ? "https://youtube.com"
          : key === "tiktok"
            ? "https://tiktok.com"
            : key === "facebook"
              ? "https://facebook.com"
              : "#",
  }));


  const influencers: Influencer[] = (campaign?.preferredInfluencers ?? []).map(
    (i: any) => ({
      imageUrl: i?.profileImg ?? "/avatar-fallback.png",
      name: `${i?.firstName ?? ""} ${i?.lastName ?? ""}`.trim(),
    })
  );

  const stats = [
    { label: "Final Quote Budget", value: totalBudget },
    { label: "Target Profit / Platform Fee", value: platformFee },
    { label: "Available For Influencers", value: availableForInfluencers },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <CampaignDetailsCard
            platform={platform}
            title={campaign?.campaignName}
            description={campaign?.campaignType}
            status={campaign?.status}
            niche={campaign?.campaignNiche}
            clientAvatar={campaign?.client?.profileImg ?? "/avatar-fallback.png"}
            clientName={campaign?.client?.brandName}
            startDate={campaign?.startingDate ?? ""}
            endDate={
              campaign?.startingDate && campaign?.duration
                ? new Date(
                  new Date(campaign.startingDate).getTime() +
                  Number(campaign.duration) * 24 * 60 * 60 * 1000
                )
                  .toISOString()
                  .slice(0, 10)
                : ""
            }
            influencers={influencers}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <CampaignQuoteDetails revisedCount={0} currencySymbol="৳" platform={platform} />
        </div>
      </div>

      <CampaignStepper currentStep={campaign?.currentStep ?? 1} />

      <PlatformProfit
        campaignStatus={campaignStatus}
        stats={stats}
        invitationStatus={invitationStatus}
      />

      <InfluencerPaymentMethod
        campaignStatus={campaignStatus}
        invitationStatus={invitationStatus}
      />

      <CampaignMilestoneContainer
        campaignStatus={campaignStatus}
        invitationStatus={invitationStatus}
        influencers={influencers}
      />

      <CampaignTermsCard />
      <ContentAssetCard />

      <InfluencerRatingCard
        campaignStatus={campaignStatus}
        invitationStatus={invitationStatus}
      />
    </div>
  );
}
