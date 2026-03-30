"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import CampaignSummaryCard from "./summary-card/campaign-summary-card";
import CampaignDetailsTabs from "./campaign-details-tabs";
import CampaignDetailsLoading from "./campaign-details-loading";
import { shouldShowAgencyQuotationTabs } from "../_lib/campaign-status";
import { getCampaignDetails } from "@/service/client/campaigns/campaign-details";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";

type CampaignDetailsContextValue = {
  campaign: ClientCampaignDetails;
  refreshCampaign: () => Promise<void>;
};

const CampaignDetailsContext =
  React.createContext<CampaignDetailsContextValue | null>(null);

export function useCampaignDetails() {
  const context = React.useContext(CampaignDetailsContext);

  if (!context) {
    throw new Error(
      "useCampaignDetails must be used inside CampaignDetailsProvider",
    );
  }

  return context;
}

type CampaignDetailsProviderProps = {
  children: React.ReactNode;
};

export default function CampaignDetailsProvider({
  children,
}: CampaignDetailsProviderProps) {
  const params = useParams();
  const id = params.id as string;

  const [campaign, setCampaign] = React.useState<ClientCampaignDetails | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCampaign = React.useCallback(
    async (showLoading = true) => {
      if (!id) return;

      if (showLoading) {
        setLoading(true);
      }

      try {
        const data = await getCampaignDetails(id);

        if (!data) {
          setCampaign(null);
          setError("Campaign not found. Reload again.");
          return;
        }

        setCampaign(data);
        setError(null);
      } catch (error) {
        console.error("Failed to load campaign details:", error);
        setCampaign(null);
        setError("Campaign not found. Reload again.");
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [id],
  );

  React.useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  const refreshCampaign = React.useCallback(async () => {
    await fetchCampaign(false);
  }, [fetchCampaign]);

  if (loading) {
    return <CampaignDetailsLoading />;
  }

  if (!campaign || error) {
    return (
      <div className="rounded-xl border border-light-gray bg-white p-6">
        <p className="text-center text-sm text-black/70">
          {error || "Please reload again."}
        </p>
      </div>
    );
  }

  const showTabs = shouldShowAgencyQuotationTabs(
    campaign.campaignType,
    campaign.status,
  );

  return (
    <CampaignDetailsContext.Provider
      value={{ campaign, refreshCampaign }}
    >
      <div className="space-y-4">
        <CampaignSummaryCard campaign={campaign} />
        {showTabs ? <CampaignDetailsTabs /> : null}
        {children}
      </div>
    </CampaignDetailsContext.Provider>
  );
}