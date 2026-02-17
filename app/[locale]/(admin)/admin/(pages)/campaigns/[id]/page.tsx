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

function mapStatusToUI(status: string | undefined) {
  // ✅ your UI expects these exact values
  // backend has: received, etc.
  const s = (status ?? "").toLowerCase();
  if (s === "received") return "Need Quote";
  if (s === "pending") return "Pending Invitations";
  if (s === "active") return "Active";
  if (s === "completed") return "Completed";
  if (s === "paid") return "Paid";
  return "Need Quote";
}

function mapCampaignStatus(status: string | undefined): CampaignStatusType {
  const s = (status ?? "").toLowerCase();
  if (s === "received") return "needs-quote";
  if (s === "pending" || s === "pending-invitations") return "pending-invitations";
  if (s === "active") return "active";
  if (s === "completed") return "completed";
  if (s === "paid") return "paid";
  return "needs-quote";
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const campaignId = id;

  // ✅ currently your UI flow uses these
  // you can later drive these from backend if you have fields
  const invitationStatus: InvitationStatusType = "sent";

  const [campaign, setCampaign] = useState<any>(null);

  useEffect(() => {
    if (!campaignId) return;

    (async () => {
      const res = await getCampaignById(campaignId);
      // some axios wrappers return {data: ...}, some return directly
      setCampaign(res?.data ?? res);
    })();
  }, [campaignId]);

  if (!campaign) return <div>Loading...</div>;

  // ---------------- derived from backend ----------------
  const totalBudget = Number(campaign?.financials?.totalBudget ?? 0);
  const clientBudget = Number(campaign?.financials?.clientBudget ?? 0);
  const vatAmount = Number(campaign?.financials?.vatAmount ?? 0);
  const netPayableAmount = Number(campaign?.financials?.netPayableAmount ?? 0);

  // ✅ FIXED 2% (NO EDIT)
  const platformFeePercent = 2;
  const platformFeeAmount = Math.round((totalBudget * platformFeePercent) / 100);
  const availableForInfluencers = Math.max(0, totalBudget - platformFeeAmount);




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
    { label: "Final Quoted Budget", value: totalBudget },
    { label: "Target Profit / Platform Fee", value: platformFeeAmount }, // amount
    { label: "Available For Influencers", value: availableForInfluencers },
  ];

  const campaignStatus: CampaignStatusType = mapCampaignStatus(campaign?.status);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <CampaignDetailsCard
            platform={platform}
            title={campaign?.campaignName}
            description={campaign?.campaignType}
            status={mapStatusToUI(campaign?.status)}
            niche={campaign?.campaignNiche}
            clientAvatar={campaign?.client?.profileImg ?? "/avatar-fallback.png"}
            clientName={campaign?.client?.brandName ?? ""}
            startDate={campaign?.timeline?.startingDate ?? ""}
            endDate={(campaign?.timeline?.endDate ?? "").slice(0, 10)}
            influencers={influencers}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <CampaignQuoteDetails
            revisedCount={0}
            currencySymbol="৳"
            platform={platform}
            clientBudget={clientBudget}
            vatAmount={vatAmount}
            totalBudget={totalBudget}
            netPayableAmount={netPayableAmount}
            campaignName={campaign?.campaignName}
            clientName={campaign?.client?.brandName}
          />
        </div>
      </div>

      <CampaignStepper currentStep={campaign?.currentStep ?? 1} />

      <PlatformProfit
        campaignStatus={campaignStatus}
        stats={stats}
        invitationStatus={invitationStatus}
        totalBudget={totalBudget} // ✅ IMPORTANT (remove hardcoded 100000)
      />

      <InfluencerPaymentMethod
        campaignStatus={campaignStatus}
        invitationStatus={invitationStatus}
      />

      <CampaignMilestoneContainer
        invitationStatus={invitationStatus}
        campaignStatus={campaignStatus}
        influencers={influencers}
        milestones={campaign?.milestones ?? []}
      />


      <CampaignTermsCard
        campaignGoals={campaign?.campaignGoals ?? ""}
        productServiceDetails={campaign?.productServiceDetails ?? ""}
        reportingRequirements={campaign?.reportingRequirements ?? ""}
        usageRights={campaign?.usageRights ?? ""}
        needSampleProduct={!!campaign?.needSampleProduct}
        milestones={campaign?.milestones ?? []}
      />

      <ContentAssetCard assets={campaign?.assets ?? []} />

      <InfluencerRatingCard
        campaignStatus={campaignStatus}
        invitationStatus={invitationStatus}
      />
    </div>
  );
}
