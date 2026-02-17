"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllCampaigns } from "@/api/admin/campaign/get-campaign";

import CampaignsHeader from "./campaigns-header";
import CampaignsToolbar from "./campaigns-toolbar";
import CampaignsBulkBar from "./campaigns-bulkbar";
import CampaignsListTable from "./campaigns-list-table";
import CampaignsGrid from "./campaigns-grid";

import type { CampaignStatus, CampaignUI, CampaignView } from "@/types/admin/campaign/campaign-ui_type";
import type { GetCampaignResponse } from "@/types/campaign/get_campaign_type";
import { mapApiCampaignToUI } from "@/utils/admin/campaign/campaign-mapper_type";

import type { CampaignTabKey } from "@/types/admin/campaign/campaign-filter_types";
import CampaignsStatusTabs from "./campaigns-status-tabs";
import { TAB_TO_BACKEND_STATUSES } from "@/utils/admin/campaign/campaign-status-tab_util";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignUI[]>([]);
  const [view, setView] = useState<CampaignView>("grid");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<CampaignTabKey>("all");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = (await getAllCampaigns({ page: 1, limit: 10 })) as GetCampaignResponse;
        const list = Array.isArray((res as any)?.data) ? (res as any).data : [];
        const mapped: CampaignUI[] = list.map(mapApiCampaignToUI);

        // ✅ DEBUG: see what statuses you actually have from API
        console.log("API STATUSES:", mapped.map((x) => x.status));

        setCampaigns(mapped);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      }
    };
    fetchCampaigns();
  }, []);

  const filtered = useMemo(() => {
    let list = campaigns;

    // ✅ tab filter
    if (tab !== "all") {
      const allowed = TAB_TO_BACKEND_STATUSES[tab] || [];
      list = list.filter((c) => allowed.includes(c.status));

      // ✅ DEBUG: see filtering result
      console.log("FILTER:", tab, "allowed:", allowed, "result:", list.length);
    } else {
      console.log("FILTER: all", "result:", list.length);
    }

    // ✅ search filter
    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter((c) => c.name.toLowerCase().includes(q));
  }, [campaigns, tab, query]);

  const handleStatusChange = (id: string, status: CampaignStatus) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  return (
    <Card>
      <CampaignsHeader
        tabs={<CampaignsStatusTabs items={campaigns} value={tab} onChange={setTab} />}
      />

      <CardContent className="space-y-4">
        <CampaignsToolbar
          view={view}
          setView={setView}
          query={query}
          setQuery={setQuery}
        />

        <CampaignsBulkBar />

        {view === "list" ? (
          <CampaignsListTable campaigns={filtered} onStatusChange={handleStatusChange} />
        ) : (
          <CampaignsGrid campaigns={filtered} view={view} onStatusChange={handleStatusChange} />
        )}
      </CardContent>
    </Card>
  );
}
