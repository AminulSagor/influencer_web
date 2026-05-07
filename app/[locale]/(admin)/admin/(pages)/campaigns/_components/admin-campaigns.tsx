"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAllCampaigns
} from "@/service/admin/campaign/get-campaign";
import { updateCampaignStatus } from "@/service/admin/campaign/update-campaign-status";

import CampaignsHeader from "./campaigns-header";
import CampaignsToolbar from "./campaigns-toolbar";
import CampaignsBulkActionBar from "./campaigns-bulk-action-bar";
import CampaignsListTable from "./campaigns-list-table";
import CampaignsGrid from "./campaigns-grid";
import CampaignsStatusTabs, { ORDER, type CampaignTabKey } from "./campaigns-status-tabs";
import CampaignsPagination from "./campaigns-pagination";
import { exportCampaignsToCSV } from "@/utils/admin/campaign/campaign_export_util";

import type {
  CampaignAssigneeUI,
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

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toArray(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function getAssigneeName(raw: any) {
  const profile = raw?.agency ?? raw?.influencer ?? raw?.profile ?? raw?.user ?? raw;
  const firstLast = [profile?.firstName, profile?.lastName]
    .map(toText)
    .filter(Boolean)
    .join(" ");

  return (
    toText(profile?.name) ||
    toText(profile?.fullName) ||
    toText(profile?.agencyName) ||
    toText(raw?.name) ||
    toText(raw?.agencyName) ||
    firstLast ||
    "Assigned"
  );
}

function getAssigneeAvatar(raw: any) {
  const profile = raw?.agency ?? raw?.influencer ?? raw?.profile ?? raw?.user ?? raw;

  return (
    toText(profile?.profileImage) ||
    toText(profile?.profileImg) ||
    toText(profile?.ImageUrl) ||
    toText(profile?.imageUrl) ||
    toText(profile?.image) ||
    toText(profile?.logo) ||
    toText(raw?.profileImage) ||
    toText(raw?.profileImg) ||
    toText(raw?.ImageUrl) ||
    toText(raw?.imageUrl) ||
    toText(raw?.image) ||
    toText(raw?.logo) ||
    ""
  );
}

function getAssigneeLocation(raw: any) {
  const profile = raw?.agency ?? raw?.influencer ?? raw?.profile ?? raw?.user ?? raw;
  const city = toText(profile?.city) || toText(raw?.city);
  const country = toText(profile?.country) || toText(raw?.country);
  const address = toText(profile?.address) || toText(raw?.address);

  if (city && country) return `${city}, ${country}`;
  return city || country || address || "Dhaka, Bangladesh";
}

function normalizeAssignedPersonals(item: AdminCampaignApiItem): CampaignAssigneeUI[] {
  const agencySource = toArray((item as any).assignedAgency).length
    ? toArray((item as any).assignedAgency)
    : toArray((item as any).assignedAgencies);
  const influencerSource = toArray(item.assignedInfluencers);
  const source = String(item.campaignType || "").toLowerCase() === "paid_ad"
    ? agencySource
    : influencerSource;
  const fallbackSource = source.length ? source : [...agencySource, ...influencerSource];

  return fallbackSource.map((raw, index) => {
    const profile = raw?.agency ?? raw?.influencer ?? raw?.profile ?? raw?.user ?? raw;

    return {
      id: String(
        raw?.agencyId ??
          raw?.influencerId ??
          raw?.profileId ??
          profile?.id ??
          raw?.id ??
          index
      ),
      name: getAssigneeName(raw),
      avatar: getAssigneeAvatar(raw),
      location: getAssigneeLocation(raw),
    };
  });
}

function mapCampaignToUI(item: AdminCampaignApiItem): CampaignUI {
  const budget = Number(item.totalBudget || 0);
  const assignedPersonals = normalizeAssignedPersonals(item);

  return {
    id: item.id,
    name: item.campaignName || "Untitled Campaign",
    category: formatCampaignTypeLabel(item.campaignType),
    niches: "—",
    avatar:
      item.client?.profileImg || item.client?.image || item.client?.logo || "",
    client: item.client?.brandName || "—",
    budget,
    quote: budget,
    startDate: formatDate(item.startingDate),
    endDate: addDays(item.startingDate, item.duration),
    status: item.status as CampaignStatus,
    assignedPersonals: {
      count: assignedPersonals.length,
      influencers: assignedPersonals,
    },
    paymentStatus: normalizePaymentStatus(item.paymentStatus),
  } as CampaignUI;
}

export default function AdminCampaigns() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as CampaignTabKey) || "all";

  const [campaigns, setCampaigns] = useState<CampaignUI[]>([]);
  const [view, setView] = useState<CampaignView>("grid");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [tab, setTab] = useState<CampaignTabKey>(initialTab);
  const [campaignType, setCampaignType] = useState<CampaignTypeFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);

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

  const handleStatusChange = async (id: string, status: CampaignStatus) => {
    const currentCampaign = campaigns.find((c) => c.id === id);
    const currentStatus = currentCampaign?.status;

    // Only hit backend if the dropdown value actually changed.
    if (!currentStatus || currentStatus === status) return;

    // Optimistic UI update.
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id ? { ...campaign, status } : campaign
      )
    );

    try {
      await updateCampaignStatus(id, status);
      toast.success("Campaign status updated");
      // Refresh to respect current tab/filter (status change may move the campaign).
      router.refresh();
    } catch (err) {
      console.error("Failed to update campaign status", err);
      // Rollback on failure.
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === id ? { ...campaign, status: currentStatus } : campaign
        )
      );
      toast.error("Failed to update campaign status");
    }
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

        <CampaignsBulkActionBar
          selectedCount={selectedCampaignIds.length}
          onExport={() => {
            const selectedCampaigns = campaigns.filter((c) =>
              selectedCampaignIds.includes(c.id)
            );
            exportCampaignsToCSV(selectedCampaigns);
          }}
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
            selectedCampaignIds={selectedCampaignIds}
            onToggleSelect={(id, checked) => {
              setSelectedCampaignIds((prev) =>
                checked ? [...prev, id] : prev.filter((p) => p !== id)
              );
            }}
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