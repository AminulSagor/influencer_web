"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
  const s = (status ?? "").toLowerCase();
  if (s === "received") return "Need Quote";
  if (s === "pending") return "Pending Invitations";
  if (s === "pending_influencer") return "Pending Invitations";
  if (s === "active") return "Active";
  if (s === "completed") return "Completed";
  if (s === "paid") return "Paid";
  return "Need Quote";
}

function mapCampaignStatus(status: string | undefined): CampaignStatusType {
  const s = (status ?? "").toLowerCase();
  if (s === "received") return "needs-quote";
  if (s === "pending" || s === "pending-invitations") return "pending-invitations";
  if (s === "pending_influencer") return "pending-invitations";
  if (s === "active") return "active";
  if (s === "completed") return "completed";
  if (s === "paid") return "paid";
  return "needs-quote";
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const campaignId = id;

  const invitationStatus: InvitationStatusType = "sent";
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCampaign = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const res = await getCampaignById(campaignId);
      setCampaign(res);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  // ✅ derive quoteState from backend (reload-safe)
  const rawStatus = String(campaign?.status ?? "").toLowerCase();

  const waitingFor = String(
    campaign?.negotiation?.waitingFor ??
    campaign?.quote?.waitingFor ??
    campaign?.waitingFor ??
    ""
  ).toLowerCase();

  const quoteState = useMemo<"none" | "sent" | "confirmed">(() => {
    if (rawStatus === "pending_influencer") return "confirmed";
    if (waitingFor === "client") return "sent";
    return "none";
  }, [rawStatus, waitingFor]);

  // ---------------- derived values ----------------
  const totalBudget = Number(campaign?.financials?.totalBudget ?? 0);
  const clientBudget = Number(campaign?.financials?.clientBudget ?? 0);
  const vatAmount = Number(campaign?.financials?.vatAmount ?? 0);
  const netPayableAmount = Number(campaign?.financials?.netPayableAmount ?? 0);

  const paidAmount =
    Number(campaign?.financials?.paidAmount ?? 0) ||
    Number(campaign?.negotiation?.agreedBudget ?? 0) ||
    Number(campaign?.agreedBudget ?? 0) ||
    0;

  const dueAmount =
    Number(campaign?.financials?.dueAmount ?? 0) ||
    Number(campaign?.negotiation?.dueAmount ?? 0) ||
    Number(campaign?.dueAmount ?? 0) ||
    0;

  const platformFeePercent = 2;
  const platformFeeAmount = Math.round((totalBudget * platformFeePercent) / 100);
  const availableForInfluencers = Math.max(0, totalBudget - platformFeeAmount);

  const platform = useMemo(() => {
    const keys = Array.from(
      new Set<string>(
        (campaign?.milestones ?? [])
          .map((m: any) => m?.platform)
          .filter((p: any): p is string => typeof p === "string" && p.length > 0)
      )
    );

    return keys.map((key) => ({
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
  }, [campaign?.milestones]);

  const influencers: Influencer[] = useMemo(() => {
    return (campaign?.preferredInfluencers ?? []).map((i: any, idx: number) => ({
      imageUrl: i?.profileImg ?? "/avatar-fallback.png",
      name: `${i?.firstName ?? ""} ${i?.lastName ?? ""}`.trim() || `Influencer ${idx + 1}`,
    }));
  }, [campaign?.preferredInfluencers]);

  const stats = useMemo(
    () => [
      { label: "Final Quoted Budget", value: totalBudget },
      { label: "Target Profit / Platform Fee", value: platformFeeAmount },
      { label: "Available For Influencers", value: availableForInfluencers },
    ],
    [totalBudget, platformFeeAmount, availableForInfluencers]
  );

  const campaignStatus: CampaignStatusType = mapCampaignStatus(campaign?.status);

  if (loading || !campaign) return <div>Loading...</div>;

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
            campaignId={campaignId}
            quoteState={quoteState}
            onRefresh={fetchCampaign}
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

      <CampaignStepper campaignId={campaignId} />

      <PlatformProfit
        preferredInfluencers={campaign?.preferredInfluencers}
        notPreferableInfluencers={campaign?.notPreferableInfluencers}
        campaignStatus={campaignStatus}
        stats={stats}
        invitationStatus={invitationStatus}
        quoteState={quoteState}
      />

      <InfluencerPaymentMethod campaignStatus={campaignStatus} invitationStatus={invitationStatus} />

      <CampaignMilestoneContainer
        invitationStatus={invitationStatus}
        campaignStatus={campaignStatus}
        influencers={influencers as any}
        dropdownInfluencers={campaign?.preferredInfluencers ?? []}
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

      <InfluencerRatingCard campaignStatus={campaignStatus} invitationStatus={invitationStatus} />
    </div>
  );
}
