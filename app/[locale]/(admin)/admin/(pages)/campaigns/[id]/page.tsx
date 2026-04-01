"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";

import { getAdminCampaignById } from "@/service/admin/campaign/agency/get-campaign-agency-by-id";
import { getAssignedAgencies } from "@/service/admin/campaign/agency/get-assigned-agencies";
import { getCampaignNegotiations } from "@/service/admin/campaign/get-campaign-negotiations";

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

import { getAdminAgencyProfile } from "@/service/admin/campaign/agency/get-admin-agency-profile";
import { getAllAgencies } from "@/service/admin/campaign/agency/get-all-agencies";

import {
  normalize,
  mapStatusToUI,
  mapCampaignStatus,
  computeQuoteState,
  getCampaignTypeFlags,
  getPlatformListFromMilestones,
  getInfluencerAvatars,
  computeFinancials,
} from "@/utils/admin/campaign/campaign_page_util";

import {
  getNegotiationAwareQuoteState,
  getNegotiationFinancials,
  getNegotiationRevisedCount,
} from "@/utils/admin/campaign/campaign_negotiation_util";

import type {
  CampaignNegotiationItem,
  CampaignNegotiationMeta,
} from "@/service/admin/campaign/get-campaign-negotiations";

type PreferredAgency = { id: string; name: string; image?: string | null };

function safeStr(v: unknown) {
  return String(v ?? "").trim();
}

function toNum(v: unknown) {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const campaignId = id;

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [negotiations, setNegotiations] = useState<CampaignNegotiationItem[]>([]);
  const [negotiationCampaignMeta, setNegotiationCampaignMeta] =
    useState<CampaignNegotiationMeta | null>(null);

  const [preferredAgencies, setPreferredAgencies] = useState<PreferredAgency[]>([]);
  const [loadingPreferredAgencies, setLoadingPreferredAgencies] = useState(false);

  const [assignedAgenciesDraft, setAssignedAgenciesDraft] = useState<any[]>([]);
  const [loadingAssignedAgencies, setLoadingAssignedAgencies] = useState(false);

  const [assignedInfluencerOfferTotal, setAssignedInfluencerOfferTotal] =
    useState<number>(0);

  const fetchCampaign = useCallback(async () => {
    if (!campaignId) return;
    const res = await getAdminCampaignById(campaignId);
    
    let assignedInfluencers = undefined;
    try {
      const { getAllCampaigns } = await import("@/service/admin/campaign/get-campaign");
      // Search by campaign name to ensure it is returned in the list
      const allRes = await getAllCampaigns({ search: res?.data?.campaignName });
      const match = allRes?.data?.find((c: any) => c.id === campaignId);
      if (match?.assignedInfluencers) {
        assignedInfluencers = match.assignedInfluencers;
      }
    } catch (err) {
      console.error("Failed to fetch assignedInfluencers from all campaigns API", err);
    }

    setCampaign({
      ...(res?.data ?? {}),
      assignedInfluencers,
    });
  }, [campaignId]);

  const fetchNegotiations = useCallback(async () => {
    if (!campaignId) return;

    try {
      const res = await getCampaignNegotiations(campaignId);

      setNegotiationCampaignMeta(res?.data?.campaign ?? null);
      setNegotiations(Array.isArray(res?.data?.negotiations) ? res.data.negotiations : []);
    } catch {
      setNegotiationCampaignMeta(null);
      setNegotiations([]);
    }
  }, [campaignId]);

  const refreshQuoteSection = useCallback(async () => {
    await Promise.all([fetchCampaign(), fetchNegotiations()]);
  }, [fetchCampaign, fetchNegotiations]);

  const fetchAssignedAgencies = useCallback(async () => {
    if (!campaignId) return;
    setLoadingAssignedAgencies(true);
    try {
      const res = await getAssignedAgencies(campaignId);
      const list = res?.data?.data ?? [];
      setAssignedAgenciesDraft(Array.isArray(list) ? list : []);
    } catch {
      setAssignedAgenciesDraft([]);
    } finally {
      setLoadingAssignedAgencies(false);
    }
  }, [campaignId]);

  const fetchPreferredAgenciesFromSuggested = useCallback(
    async (suggestedIds: string[]) => {
      const ids = Array.from(
        new Set((suggestedIds ?? []).map((x) => String(x).trim()))
      ).filter(Boolean);

      if (ids.length === 0) {
        setPreferredAgencies([]);
        return;
      }

      setLoadingPreferredAgencies(true);

      try {
        const agencyMap = new Map<string, { name: string; image: string | null }>();

        try {
          const agenciesRes: any = await getAllAgencies();
          const list =
            agenciesRes?.data?.data ?? agenciesRes?.data ?? agenciesRes ?? [];

          (Array.isArray(list) ? list : []).forEach((a: any) => {
            const id = String(a?.id ?? "").trim();
            if (!id) return;

            agencyMap.set(id, {
              name: String(a?.agencyName ?? a?.fullName ?? "Agency"),
              image: a?.logo ?? null,
            });
          });
        } catch { }

        const results = await Promise.all(
          ids.map(async (profileId) => {
            try {
              const res = await getAdminAgencyProfile(profileId);
              return {
                id: String(res?.data?.profileid ?? profileId),
                name: String(res?.data?.name ?? "Agency"),
                image: res?.data?.image ?? null,
              };
            } catch {
              const fallback = agencyMap.get(profileId);
              return fallback
                ? { id: profileId, name: fallback.name, image: fallback.image }
                : { id: profileId, name: "Agency", image: null };
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
    let ignore = false;

    const boot = async () => {
      if (!campaignId) return;

      setLoading(true);
      try {
        await Promise.all([fetchCampaign(), fetchNegotiations(), fetchAssignedAgencies()]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    boot();

    return () => {
      ignore = true;
    };
  }, [campaignId, fetchCampaign, fetchNegotiations, fetchAssignedAgencies]);

  useEffect(() => {
    const handler = () => {
      fetchCampaign();
      fetchNegotiations();
      fetchAssignedAgencies();
    };

    window.addEventListener("influencer-assigned", handler);
    window.addEventListener("agency-assigned", handler);
    window.addEventListener("app-notification", handler);

    return () => {
      window.removeEventListener("influencer-assigned", handler);
      window.removeEventListener("agency-assigned", handler);
      window.removeEventListener("app-notification", handler);
    };
  }, [fetchCampaign, fetchNegotiations, fetchAssignedAgencies]);

  useEffect(() => {
    if (!campaign) return;
    const suggested = campaign?.suggestedAgencies ?? [];
    fetchPreferredAgenciesFromSuggested(Array.isArray(suggested) ? suggested : []);
  }, [campaign, fetchPreferredAgenciesFromSuggested]);

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

  const fallbackQuoteState = useMemo(
    () => computeQuoteState({ campaign, rawStatus, rawQuoteStatus, waitingFor }),
    [campaign, rawStatus, rawQuoteStatus, waitingFor]
  );

  const quoteState = useMemo(
    () =>
      getNegotiationAwareQuoteState({
        fallbackQuoteState,
        campaignMeta: negotiationCampaignMeta,
        negotiations,
      }),
    [fallbackQuoteState, negotiationCampaignMeta, negotiations]
  );

  const campaignStatus = useMemo(
    () => mapCampaignStatus(campaign?.status),
    [campaign?.status]
  );

  const cardStatus = useMemo(
    () => {
      const payment = normalize(campaign?.paymentStatus);

      // If payment is fully done, surface it as "Paid" on the header card.
      if (payment === "full" || payment === "paid") {
        return "Paid" as const;
      }

      return mapStatusToUI(campaign?.status);
    },
    [campaign?.paymentStatus, campaign?.status]
  );

  const { isPaidAd } = useMemo(() => getCampaignTypeFlags(campaign), [campaign]);

  const baseFinancials = useMemo(() => computeFinancials(campaign), [campaign]);

  const negotiationFinancials = useMemo(
    () => getNegotiationFinancials(negotiations, baseFinancials),
    [negotiations, baseFinancials]
  );

  const totalBudget = negotiationFinancials.totalBudget;
  const clientBudget = negotiationFinancials.clientBudget;
  const vatAmount = negotiationFinancials.vatAmount;
  const netPayableAmount = negotiationFinancials.netPayableAmount;
  const paidAmount = useMemo(
    () => toNum(campaign?.paidAmount),
    [campaign?.paidAmount]
  );
  const dueAmount = useMemo(
    () => toNum(campaign?.dueAmount),
    [campaign?.dueAmount]
  );
  const platformFeePercent = negotiationFinancials.platformFeePercent;
  const platformFeeAmount = negotiationFinancials.platformFeeAmount;
  const availableForInfluencers = negotiationFinancials.availableForInfluencers;

  const availableForAgency = useMemo(() => {
    if (isPaidAd) {
      return Math.round(toNum(campaign?.availableBudgetForExecution));
    }
    return negotiationFinancials.availableForAgency;
  }, [isPaidAd, campaign?.availableBudgetForExecution, negotiationFinancials.availableForAgency]);

  const revisedCount = useMemo(
    () => getNegotiationRevisedCount(negotiations),
    [negotiations]
  );

  const platform = useMemo(
    () => getPlatformListFromMilestones(campaign?.milestones ?? []),
    [campaign?.milestones]
  );

  const influencers = useMemo(
    () => {
      const list = campaign?.assignedInfluencers?.length 
        ? campaign.assignedInfluencers 
        : (campaign?.preferredInfluencers ?? []);
      return getInfluencerAvatars(list);
    },
    [campaign?.assignedInfluencers, campaign?.preferredInfluencers]
  );

  const assignedInfluencersForPayment = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        avatarUrl?: string | null;
      }
    >();

    (campaign?.milestones ?? []).forEach((m: any) => {
      const profileId = safeStr(m?.assignedToInfluencerId);
      if (!profileId) return;

      if (!map.has(profileId)) {
        map.set(profileId, {
          id: profileId,
          name: safeStr(m?.influencerName) || "Unknown Influencer",
          avatarUrl: m?.influencerImage ?? "/avatar-fallback.png",
        });
      }
    });

    return Array.from(map.values());
  }, [campaign?.milestones]);

  const stats = useMemo(
    () => [
      { label: "Final Quoted Budget", value: totalBudget },
      { label: "Target Profit / Platform Fee", value: platformFeeAmount },
      { label: "Available For Influencers", value: availableForInfluencers },
    ],
    [totalBudget, platformFeeAmount, availableForInfluencers]
  );

  const selectedAgencyForPayment = useMemo(() => {
    const selectedAgencyId = safeStr(campaign?.selectedAgencyId);
    if (!selectedAgencyId) return null;

    const assignedAgency = (campaign?.assignedAgencies ?? []).find((item: any) => {
      const agencyId = safeStr(item?.agencyId ?? item?.agency?.id ?? item?.id);
      return agencyId === selectedAgencyId;
    });

    const agency = assignedAgency?.agency ?? assignedAgency;
    if (!agency) return null;

    return {
      id: selectedAgencyId,
      name: safeStr(agency?.agencyName ?? agency?.name) || "Assigned Agency",
      image: agency?.logo ?? agency?.image ?? null,
    };
  }, [campaign?.selectedAgencyId, campaign?.assignedAgencies]);

  const useAgencyProfitUI = isPaidAd || rawStatus === "pending_agency" || rawStatus === "agency_accepted";
  const isActiveInfluencerCampaign = !isPaidAd && campaignStatus === "active";

  if (loading || !campaign) return <div>Loading...</div>;
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <CampaignDetailsCard
            platform={platform}
            title={campaign?.campaignName}
            description={campaign?.campaignType}
            status={cardStatus}
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
            onRefresh={refreshQuoteSection}
            revisedCount={revisedCount}
            currencySymbol="৳"
            platform={platform}
            clientBudget={clientBudget}
            vatAmount={vatAmount}
            totalBudget={totalBudget}
            netPayableAmount={netPayableAmount}
            campaignStatus={campaign?.status}
            paidAmount={paidAmount}
            dueAmount={dueAmount}
            campaignName={campaign?.campaignName}
            clientName={campaign?.client?.brandName}
          />
        </div>
      </div>

      <CampaignStepper
        status={campaign?.status}
        paymentStatus={campaign?.paymentStatus}
      />

      {useAgencyProfitUI ? (
        <PlatformProfitAgency
          campaignId={campaignId}
          stats={stats}
          quoteState={quoteState}
          platformFeePercent={platformFeePercent}
          preferredAgencies={preferredAgencies.map((a) => ({
            id: a.id,
            name: a.name,
            image: a.image,
          }))}
          loadingPreferredAgencies={loadingPreferredAgencies}
          draftAssignedAgencies={assignedAgenciesDraft}
          loadingDraftAssignedAgencies={loadingAssignedAgencies}
          onRefreshDraft={fetchAssignedAgencies}
          campaignStatusRaw={rawStatus}
          selectedAgency={selectedAgencyForPayment ?? undefined}
          offeredAmount={availableForAgency}
        />
      ) : (
        <PlatformProfit
          campaignId={campaignId}
          stats={stats}
          quoteState={quoteState}
          campaignStatus={campaignStatus}
          preferredInfluencers={campaign?.preferredInfluencers ?? []}
          notPreferableInfluencers={campaign?.notPreferableInfluencers ?? []}
          onAssignedOfferTotalChange={setAssignedInfluencerOfferTotal}
        />
      )}

      {isActiveInfluencerCampaign && (
        <InfluencerPaymentMethod
          campaignStatus={campaignStatus}
          assignedInfluencers={assignedInfluencersForPayment}
        />
      )}

      <CampaignMilestoneContainer
        campaignId={campaignId}
        campaignStatus={campaignStatus}
        isPaidAd={isPaidAd}
        influencers={influencers as any}
        dropdownInfluencers={campaign?.preferredInfluencers ?? []}
        milestones={campaign?.milestones ?? []}
        availableForInfluencers={availableForInfluencers}
        availableForAgency={availableForAgency}
        assignedInfluencerOfferTotal={assignedInfluencerOfferTotal}
      />

      <CampaignTermsCard
        campaignGoals={campaign?.campaignGoals ?? ""}
        productServiceDetails={campaign?.productServiceDetails ?? ""}
        reportingRequirements={campaign?.reportingRequirements ?? ""}
        usageRights={campaign?.usageRights ?? ""}
        needSampleProduct={false}
        milestones={campaign?.milestones ?? []}
      />

      <ContentAssetCard assets={campaign?.assets ?? []} />
      <InfluencerRatingCard
        campaignId={campaignId}
        campaignType={campaign?.campaignType}
        campaignStatus={campaignStatus}
        agencyIsRated={Boolean(campaign?.isRated)}
        agencyRating={toNum(campaign?.rating)}
        agencyName={selectedAgencyForPayment?.name ?? "Agency"}
        agencyAvatarUrl={selectedAgencyForPayment?.image ?? undefined}
      />
    </div>
  );
}