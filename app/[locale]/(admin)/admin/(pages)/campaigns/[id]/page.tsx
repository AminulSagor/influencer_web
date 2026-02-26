"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";

import { getAdminCampaignById } from "@/api/admin/campaign/agency/get-campaign-agency-by-id";
import { getAssignedAgencies } from "@/api/admin/campaign/agency/get-assigned-agencies";

import CampaignDetailsCard from "../campaign-details/_components/campaign-details-card";
import CampaignMilestoneContainer from "../campaign-details/_components/campaign-milestone-container";
import CampaignStepper from "../campaign-details/_components/campaign-stepper";
import CampaignTermsCard from "../campaign-details/_components/campaign-terms";
import CampaignQuoteDetails from "../campaign-details/_components/campaing-quote-details";
import ContentAssetCard from "../campaign-details/_components/content-asset-card";
import InfluencerPaymentMethod from "../campaign-details/_components/influencer-payment-method";
import InfluencerRatingCard from "../campaign-details/_components/influencer-rating-card";
import PlatformProfit from "../campaign-details/_components/platform-profit";
import PlatformProfitAgency from "../campaign-details/_components/platform-profit-agency";

import type { Status } from "../campaign-details/_components/campaign-details-card";
import { getAdminAgencyProfile } from "@/api/admin/campaign/agency/get-admin-agency-profile";
import { getAllAgencies } from "@/api/admin/users/agency/get-all-agencies";

export type CampaignStatusType =
  | "needs-quote"
  | "pending-invitations"
  | "active"
  | "completed"
  | "paid";

export type Influencer = { imageUrl: string; name: string };

type PreferredAgency = { id: string; name: string; image?: string | null };

// ---------------- helpers ----------------
function normalize(s: any) {
  return String(s ?? "").trim().toLowerCase();
}

const CONFIRMED_QUOTE_STATUSES = new Set([
  "pending_influencer",
  "pending_agency",
  "quote_accepted",
  "accepted",
  "confirmed",
  "approved",
  "client_accepted",
]);

const SENT_QUOTE_STATUSES = new Set([
  "quote_sent",
  "sent",
  "waiting_client",
  "pending_client",
]);

const ACTIVE_STATUSES = new Set(["active", "in_progress", "running"]);
const COMPLETED_STATUSES = new Set(["completed", "done", "finished"]);
const PAID_STATUSES = new Set(["paid", "payment_done"]);

function mapStatusToUI(status: string | undefined): Status {
  const s = normalize(status);

  if (s === "received" || s === "needs_quote") return "Need Quote";

  if (SENT_QUOTE_STATUSES.has(s)) return "Need Quote";
  if (CONFIRMED_QUOTE_STATUSES.has(s)) return "Need Quote";

  if (
    s === "pending" ||
    s === "pending_invitations" ||
    s === "pending-invitations" ||
    s === "pending_influencer"
  ) {
    return "Pending Invitations";
  }

  if (ACTIVE_STATUSES.has(s)) return "Active";
  if (COMPLETED_STATUSES.has(s)) return "Completed";
  if (PAID_STATUSES.has(s)) return "Paid";

  return "Need Quote";
}

function mapCampaignStatus(status: string | undefined): CampaignStatusType {
  const s = normalize(status);

  if (s === "received" || s === "needs_quote") return "needs-quote";

  if (
    s === "pending" ||
    s === "pending_invitations" ||
    s === "pending-invitations" ||
    s === "pending_influencer"
  ) {
    return "pending-invitations";
  }

  if (CONFIRMED_QUOTE_STATUSES.has(s)) return "active";

  if (ACTIVE_STATUSES.has(s)) return "active";
  if (COMPLETED_STATUSES.has(s)) return "completed";
  if (PAID_STATUSES.has(s)) return "paid";

  return "needs-quote";
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const campaignId = id;

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ preferred agencies (from suggestedAgencies -> profile endpoint)
  const [preferredAgencies, setPreferredAgencies] = useState<PreferredAgency[]>([]);
  const [loadingPreferredAgencies, setLoadingPreferredAgencies] = useState(false);

  // ✅ draft assigned agencies (from backend)
  const [assignedAgenciesDraft, setAssignedAgenciesDraft] = useState<any[]>([]);
  const [loadingAssignedAgencies, setLoadingAssignedAgencies] = useState(false);

  const fetchCampaign = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const res = await getAdminCampaignById(campaignId);
      setCampaign(res?.data ?? null);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  const fetchAssignedAgencies = useCallback(async () => {
    if (!campaignId) return;
    setLoadingAssignedAgencies(true);
    try {
      const res = await getAssignedAgencies(campaignId);
      const list = res?.data?.data ?? [];
      setAssignedAgenciesDraft(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("❌ getAssignedAgencies failed:", e);
      setAssignedAgenciesDraft([]);
    } finally {
      setLoadingAssignedAgencies(false);
    }
  }, [campaignId]);

const fetchPreferredAgenciesFromSuggested = useCallback(
  async (suggestedIds: string[]) => {
    const ids = Array.from(new Set((suggestedIds ?? []).map((x) => String(x).trim()))).filter(Boolean);

    if (ids.length === 0) {
      setPreferredAgencies([]);
      return;
    }

    setLoadingPreferredAgencies(true);

    try {
      // 1) fallback map from agency list (one call)
      let agencyMap = new Map<string, { name: string; image: string | null }>();

      try {
        const agenciesRes: any = await getAllAgencies(); // <-- import this in page.tsx
        const list = agenciesRes?.data?.data ?? agenciesRes?.data ?? agenciesRes ?? [];
        (Array.isArray(list) ? list : []).forEach((a: any) => {
          const id = String(a?.id ?? "").trim();
          if (!id) return;
          agencyMap.set(id, {
            name: String(a?.agencyName ?? a?.fullName ?? "Agency"),
            image: a?.logo ?? null,
          });
        });
      } catch (e) {
        // fallback map is best-effort, don't block the UI
        console.warn("⚠️ getAllAgencies failed for preferred fallback:", e);
      }

      // 2) try profile endpoint, fallback to agencyMap if 404
      const results = await Promise.all(
        ids.map(async (profileId) => {
          try {
            const res = await getAdminAgencyProfile(profileId);

            return {
              id: String(res?.data?.profileid ?? profileId),
              name: String(res?.data?.name ?? "Agency"),
              image: res?.data?.image ?? null,
            };
          } catch (e: any) {
            const status = e?.response?.status;

            // expected: backend might not have profile for some suggested IDs
            if (status === 404) {
              const fallback = agencyMap.get(profileId);
              if (fallback) {
                return { id: profileId, name: fallback.name, image: fallback.image };
              }
              return { id: profileId, name: "Agency", image: null };
            }

            console.warn("⚠️ getAdminUserProfile failed:", profileId, e?.response?.data ?? e);
            const fallback = agencyMap.get(profileId);
            if (fallback) return { id: profileId, name: fallback.name, image: fallback.image };

            return { id: profileId, name: "Agency", image: null };
          }
        })
      );

      setPreferredAgencies(results);
    } finally {
      setLoadingPreferredAgencies(false);
    }
  },
  []
);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  useEffect(() => {
    fetchAssignedAgencies();
  }, [fetchAssignedAgencies]);

  // when campaign arrives -> load suggested agencies profiles
  useEffect(() => {
    const suggested = campaign?.suggestedAgencies ?? [];
    if (!campaign) return;
    fetchPreferredAgenciesFromSuggested(Array.isArray(suggested) ? suggested : []);
  }, [campaign, fetchPreferredAgenciesFromSuggested]);

  // ---------------- campaign type ----------------
  const campaignType = normalize(campaign?.campaignType);
  const isPaidAd = campaignType === "paid_ad";
  const isInfluencerCampaign = !isPaidAd;

  // ---------------- quoteState ----------------
  const rawStatus = normalize(campaign?.status);

  const rawQuoteStatus = normalize(
    campaign?.quote?.status ??
      campaign?.negotiation?.status ??
      campaign?.quoteStatus ??
      campaign?.negotiationStatus
  );

  const waitingFor = normalize(
    campaign?.negotiation?.waitingFor ??
      campaign?.quote?.waitingFor ??
      campaign?.waitingFor
  );

  const quoteState = useMemo<"none" | "sent" | "confirmed">(() => {
    if (
      CONFIRMED_QUOTE_STATUSES.has(rawStatus) ||
      CONFIRMED_QUOTE_STATUSES.has(rawQuoteStatus) ||
      campaign?.quote?.isAccepted === true ||
      campaign?.negotiation?.isAccepted === true
    ) {
      return "confirmed";
    }

    if (
      waitingFor === "client" ||
      SENT_QUOTE_STATUSES.has(rawStatus) ||
      SENT_QUOTE_STATUSES.has(rawQuoteStatus)
    ) {
      return "sent";
    }

    return "none";
  }, [rawStatus, rawQuoteStatus, waitingFor, campaign]);

  // ---------------- financials (based on your response shape) ----------------
  const totalBudget = Number(campaign?.totalBudget ?? 0);
  const clientBudget = Number(campaign?.baseBudget ?? 0);
  const vatAmount = Number(campaign?.vatAmount ?? 0);
  const netPayableAmount = Number(campaign?.totalBudget ?? 0);

  const platformFeePercent = 2;
  const platformFeeAmount = Math.round((totalBudget * platformFeePercent) / 100);
  const availableForInfluencers = Math.max(0, totalBudget - platformFeeAmount);

  // ---------------- platform list ----------------
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

  // ---------------- influencer avatar list ----------------
  const influencers: Influencer[] = useMemo(() => {
    return (campaign?.preferredInfluencers ?? []).map((i: any, idx: number) => ({
      imageUrl: i?.profileImg ?? "/avatar-fallback.png",
      name: `${i?.firstName ?? ""} ${i?.lastName ?? ""}`.trim() || `Influencer ${idx + 1}`,
    }));
  }, [campaign?.preferredInfluencers]);

  const assignedInfluencersForPayment = useMemo(() => {
    return (campaign?.preferredInfluencers ?? []).map((i: any, idx: number) => {
      const fullName =
        (i?.name && String(i.name).trim()) ||
        `${i?.firstName ?? ""} ${i?.lastName ?? ""}`.trim();

      return {
        id: String(i?.id ?? i?._id ?? `inf-${idx + 1}`),
        name: fullName && fullName.length > 0 ? fullName : `Influencer ${idx + 1}`,
        avatarUrl: i?.profileImg ?? "/avatar-fallback.png",
        paymentMethods: Array.isArray(i?.paymentMethods) ? i.paymentMethods : [],
      };
    });
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
  const useAgencyProfitUI = isPaidAd || rawStatus === "pending_agency";

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
            startDate={campaign?.startingDate ?? ""}
            endDate={""}
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

      {useAgencyProfitUI ? (
        <PlatformProfitAgency
          campaignId={campaignId}
          stats={stats}
          quoteState={quoteState}
          platformFeePercent={platformFeePercent}
          preferredAgencies={preferredAgencies.map((a) => ({ id: a.id, name: a.name, image: a.image }))}
          loadingPreferredAgencies={loadingPreferredAgencies}
          // ✅ draft assigns
          draftAssignedAgencies={assignedAgenciesDraft}
          loadingDraftAssignedAgencies={loadingAssignedAgencies}
          onRefreshDraft={fetchAssignedAgencies}
        />
      ) : (
        <PlatformProfit
          campaignId={campaignId}
          campaignStatus={campaignStatus}
          stats={stats}
          quoteState={quoteState}
          preferredInfluencers={campaign?.preferredInfluencers ?? []}
          notPreferableInfluencers={campaign?.notPreferableInfluencers ?? []}
          onRefresh={fetchCampaign}
        />
      )}

      {isInfluencerCampaign && (
        <CampaignMilestoneContainer
          campaignId={campaignId}
          campaignStatus={campaignStatus}
          influencers={influencers as any}
          dropdownInfluencers={campaign?.preferredInfluencers ?? []}
          milestones={campaign?.milestones ?? []}
          availableForInfluencers={availableForInfluencers}
        />
      )}

      {isInfluencerCampaign && campaignStatus === "active" && (
        <InfluencerPaymentMethod
          campaignStatus={campaignStatus}
          assignedInfluencers={assignedInfluencersForPayment}
        />
      )}

      <CampaignTermsCard
        campaignGoals={campaign?.campaignGoals ?? ""}
        productServiceDetails={campaign?.productServiceDetails ?? ""}
        reportingRequirements={campaign?.reportingRequirements ?? ""}
        usageRights={campaign?.usageRights ?? ""}
        needSampleProduct={false}
        milestones={campaign?.milestones ?? []}
      />

      <ContentAssetCard assets={campaign?.assets ?? []} />
      <InfluencerRatingCard campaignStatus={campaignStatus} />
    </div>
  );
}