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

import { getAdminAgencyProfile } from "@/api/admin/campaign/agency/get-admin-agency-profile";
import { getAllAgencies } from "@/api/admin/users/agency/get-all-agencies";

import {
  normalize,
  mapStatusToUI,
  mapCampaignStatus,
  computeQuoteState,
  getCampaignTypeFlags,
  getPlatformListFromMilestones,
  getInfluencerAvatars,
  getAssignedInfluencersForPayment,
  computeFinancials,
} from "@/utils/admin/campaign/campaign_page_util";

type PreferredAgency = { id: string; name: string; image?: string | null };

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const campaignId = id;

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [preferredAgencies, setPreferredAgencies] = useState<PreferredAgency[]>([]);
  const [loadingPreferredAgencies, setLoadingPreferredAgencies] = useState(false);

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

  const fetchPreferredAgenciesFromSuggested = useCallback(async (suggestedIds: string[]) => {
    const ids = Array.from(new Set((suggestedIds ?? []).map((x) => String(x).trim()))).filter(Boolean);

    if (ids.length === 0) {
      setPreferredAgencies([]);
      return;
    }

    setLoadingPreferredAgencies(true);

    try {
      const agencyMap = new Map<string, { name: string; image: string | null }>();
      try {
        const agenciesRes: any = await getAllAgencies();
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
        console.warn("⚠️ getAllAgencies failed for preferred fallback:", e);
      }


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
            if (e?.response?.status === 404) {
              const fallback = agencyMap.get(profileId);
              return fallback
                ? { id: profileId, name: fallback.name, image: fallback.image }
                : { id: profileId, name: "Agency", image: null };
            }

            console.warn("⚠️ getAdminAgencyProfile failed:", profileId, e?.response?.data ?? e);
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
  }, []);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  useEffect(() => {
    fetchAssignedAgencies();
  }, [fetchAssignedAgencies]);

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

  const quoteState = useMemo(
    () => computeQuoteState({ campaign, rawStatus, rawQuoteStatus, waitingFor }),
    [campaign, rawStatus, rawQuoteStatus, waitingFor]
  );

  const campaignStatus = useMemo(() => mapCampaignStatus(campaign?.status), [campaign?.status]);

  const { isPaidAd } = useMemo(() => getCampaignTypeFlags(campaign), [campaign]);

  const {
    totalBudget,
    clientBudget,
    vatAmount,
    netPayableAmount,
    platformFeePercent,
    platformFeeAmount,
    availableForInfluencers,
    availableForAgency,
  } = useMemo(() => computeFinancials(campaign), [campaign]);

  const platform = useMemo(
    () => getPlatformListFromMilestones(campaign?.milestones ?? []),
    [campaign?.milestones]
  );

  const influencers = useMemo(
    () => getInfluencerAvatars(campaign?.preferredInfluencers ?? []),
    [campaign?.preferredInfluencers]
  );

  const assignedInfluencersForPayment = useMemo(
    () => getAssignedInfluencersForPayment(campaign?.preferredInfluencers ?? []),
    [campaign?.preferredInfluencers]
  );

  const stats = useMemo(
    () => [
      { label: "Final Quoted Budget", value: totalBudget },
      { label: "Target Profit / Platform Fee", value: platformFeeAmount },
      { label: "Available For Influencers", value: availableForInfluencers },
    ],
    [totalBudget, platformFeeAmount, availableForInfluencers]
  );

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
          draftAssignedAgencies={assignedAgenciesDraft}
          loadingDraftAssignedAgencies={loadingAssignedAgencies}
          onRefreshDraft={fetchAssignedAgencies}
        />
      ) : (
        <PlatformProfit
          campaignId={campaignId}
          stats={stats}
          quoteState={quoteState}
          preferredInfluencers={campaign?.preferredInfluencers ?? []}
          notPreferableInfluencers={campaign?.notPreferableInfluencers ?? []}
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
      />

      {campaignStatus === "active" && (
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