"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import {
  getAllCampaigns
} from "@/service/admin/campaign/get-campaign";

import CampaignsHeader from "./campaigns-header";
import CampaignsToolbar from "./campaigns-toolbar";
import CampaignsListTable from "./campaigns-list-table";
import CampaignsGrid from "./campaigns-grid";
import CampaignsStatusTabs, { ORDER, type CampaignTabKey } from "./campaigns-status-tabs";
import CampaignsPagination from "./campaigns-pagination";

import type {
  CampaignStatus,
  CampaignUI,
  CampaignView,
} from "@/types/admin/campaign/campaign_ui_type";
import { AdminCampaignApiItem, GetCampaignResponse } from "@/types/admin/campaign/get_campaign_type";
import toast from "react-hot-toast";

const LIMIT = 7;

type CampaignTypeFilter = "all" | "influencer_promotion" | "paid_ad";

const TAB_TO_BACKEND_STATUS: Record<Exclude<CampaignTabKey, "all">, string> = {
  "needs-quote": "negotiating",
  active: "active",
  "pending-invitation": "pending_influencer",
  completed: "completed",
  canceled: "cancelled",
};

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function addDays(dateStr?: string | null, duration?: number | null) {
  if (!dateStr || !duration) return "—";

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";

  date.setDate(date.getDate() + duration);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizePaymentStatus(status?: string | null) {
  const value = String(status || "").toLowerCase();

  if (value === "full" || value === "paid") return "paid";
  if (value === "partial" || value === "partial_paid") return "partial_paid";
  return "pending";
}

function formatCampaignTypeLabel(type?: string | null) {
  const value = String(type || "").toLowerCase();

  if (value === "paid_ad") return "Paid Ad";
  if (value === "influencer_promotion") return "Influencer Promotion";
  return type || "—";
}

function mapCampaignToUI(item: AdminCampaignApiItem): CampaignUI {
  const budget = Number(item.totalBudget || 0);

  return {
    id: item.id,
    name: item.campaignName || "Untitled Campaign",
    category: formatCampaignTypeLabel(item.campaignType),
    niches: "—",
    avatar: "",
    client: item.client?.brandName || "—",
    budget,
    quote: budget,
    startDate: formatDate(item.startingDate),
    endDate: addDays(item.startingDate, item.duration),
    status: item.status as CampaignStatus,
    assignedPersonals: {
      count: 0,
      influencers: [],
    },
    paymentStatus: normalizePaymentStatus(item.paymentStatus),
  } as CampaignUI;
}

export default function AdminCampaigns() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as CampaignTabKey) || "all";

  const [campaigns, setCampaigns] = useState<CampaignUI[]>([]);
  const [view, setView] = useState<CampaignView>("grid");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [tab, setTab] = useState<CampaignTabKey>(initialTab);
  const [campaignType, setCampaignType] = useState<CampaignTypeFilter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = searchParams.get("tab") as CampaignTabKey;
    if (t && ORDER.includes(t)) {
      setTab(t);
    }
  }, [searchParams]);

  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);

        const backendStatus =
          tab === "all" ? undefined : TAB_TO_BACKEND_STATUS[tab];

        const backendCampaignType =
          campaignType === "all" ? undefined : campaignType;

        const res: GetCampaignResponse = await getAllCampaigns({
          page,
          limit: LIMIT,
          campaignType: backendCampaignType,
          status: backendStatus,
          search: debouncedQuery || undefined,
        });

        const list = Array.isArray(res?.data) ? res.data : [];
        setCampaigns(list.map(mapCampaignToUI));

        setMeta({
          total: res?.meta?.total ?? 0,
          page: res?.meta?.page ?? 1,
          limit: res?.meta?.limit ?? LIMIT,
          totalPages: res?.meta?.totalPages ?? 1,
        });
      } catch (err) {
        toast.error("Failed to fetch campaigns:");
        setCampaigns([]);
        setMeta({
          total: 0,
          page: 1,
          limit: LIMIT,
          totalPages: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [page, tab, debouncedQuery, campaignType]);

  useEffect(() => {
    setPage(1);
  }, [tab, campaignType]);

  const handleStatusChange = (id: string, status: CampaignStatus) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id ? { ...campaign, status } : campaign
      )
    );
  };

  const showingFrom = useMemo(() => {
    if (meta.total === 0) return 0;
    return (meta.page - 1) * meta.limit + 1;
  }, [meta]);

  const showingTo = useMemo(() => {
    if (meta.total === 0) return 0;
    return Math.min(meta.page * meta.limit, meta.total);
  }, [meta]);

  return (
    <Card>
      <CampaignsHeader
        tabs={<CampaignsStatusTabs value={tab} onChange={setTab} />}
      />

      <CardContent className="space-y-4">
        <CampaignsToolbar
          view={view}
          setView={setView}
          query={query}
          setQuery={setQuery}
          campaignType={campaignType}
          setCampaignType={setCampaignType}
        />

        {loading ? (
          <div className="mx-2 rounded-md border border-dashed border-light-green p-10 text-center text-sm text-muted-foreground">
            Loading campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="mx-2 rounded-md border border-dashed border-light-green p-10 text-center text-sm text-muted-foreground">
            No campaigns found
          </div>
        ) : view === "list" ? (
          <CampaignsListTable
            campaigns={campaigns}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <CampaignsGrid
            campaigns={campaigns}
            view={view}
            onStatusChange={handleStatusChange}
          />
        )}

        <CampaignsPagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          showingFrom={showingFrom}
          showingTo={showingTo}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  );
}