"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  STATUS_QUERY,
  TAB_TITLE,
  type CampaignTabKey,
} from "./_lib/campaign-status";
import {
  BUDGETING_STATUS_QUERY,
  type BudgetingFilter,
} from "./_lib/budgeting-status";

import { useMyCampaignsByStatus } from "@/app/[locale]/(brand)/brand/hooks/useMyCampaignsByStatus";
import type { CampaignSortValue } from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/campaign-list-utils";
import CampaignTabs from "./_components/campaign-tabs";
import CampaignToolbar from "./_components/campaign-toolbar";
import CampaignListSection from "./_components/campaign-list-section";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import PageFooterPagination from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/page-footer-pagination";
import { CAMPAIGN_TAB_ITEMS } from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/campaign-tab-items";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";

const PER_PAGE = 6;

const VALID_TABS: CampaignTabKey[] = [
  "active",
  "budgeting_quoting",
  "completed",
  "draft",
  "cancelled",
];

const VALID_BUDGETING_FILTERS: BudgetingFilter[] = [
  "all",
  "budget_pending",
  "quotation_received",
];

const VALID_SORTS: CampaignSortValue[] = ["ASC", "DESC"];

function parseTab(value: string | null): CampaignTabKey {
  if (value && VALID_TABS.includes(value as CampaignTabKey)) {
    return value as CampaignTabKey;
  }

  return "active";
}

function parseBudgetingFilter(value: string | null): BudgetingFilter {
  if (value && VALID_BUDGETING_FILTERS.includes(value as BudgetingFilter)) {
    return value as BudgetingFilter;
  }

  return "all";
}

function parseSort(value: string | null): CampaignSortValue {
  if (value && VALID_SORTS.includes(value as CampaignSortValue)) {
    return value as CampaignSortValue;
  }

  return "DESC";
}

function parsePage(value: string | null): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

//==============component=======================//
export default function CampaignsPage() {
  const t = useTranslations("brand.CampaignsPage");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = parseTab(searchParams.get("tab"));
  const budgetingFilter = parseBudgetingFilter(searchParams.get("subTab"));
  const searchQuery = searchParams.get("search") ?? searchParams.get("q") ?? "";
  const currentPage = parsePage(searchParams.get("page"));
  const sortBy = parseSort(searchParams.get("sort"));
  const searchParamsString = searchParams.toString();

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [campaignReloadKey, setCampaignReloadKey] = useState(0);

  const setStep = useCampaignStore((s) => s.setStep);

  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParamsString);

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParamsString],
  );

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (searchInput === searchQuery) return;

    const timer = window.setTimeout(() => {
      const nextSearch = searchInput.trim();

      updateQueryParams({
        search: nextSearch || null,
        q: null,
        page: "1",
      });
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput, searchQuery, updateQueryParams]);

  const status =
    activeTab === "budgeting_quoting"
      ? BUDGETING_STATUS_QUERY[budgetingFilter]
      : STATUS_QUERY[activeTab];

  const { data, meta, loading, error } = useMyCampaignsByStatus(
    status,
    currentPage,
    PER_PAGE,
    searchQuery,
    sortBy,
    campaignReloadKey,
  );

  const total = meta.total ?? 0;
  const totalPages = meta.totalPages ?? 1;
  const safePage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));

  const currentItemsCount = data.length;
  const start = total === 0 ? 0 : (safePage - 1) * PER_PAGE + 1;
  const end = total === 0 ? 0 : start + currentItemsCount - 1;

  const resultText =
    total === 0 ? t("showingZeroResults") : t("showingResults", { end, total });

  const sortLabel = sortBy === "DESC" ? t("highToLow") : t("lowToHigh");

  const handleTabChange = (nextTab: CampaignTabKey) => {
    if (nextTab === "budgeting_quoting") {
      updateQueryParams({
        tab: nextTab,
        subTab: activeTab === "budgeting_quoting" ? budgetingFilter : "all",
        search: null,
        q: null,
        page: "1",
      });

      return;
    }

    updateQueryParams({
      tab: nextTab,
      subTab: null,
      search: null,
      q: null,
      page: "1",
    });
  };

  const handleBudgetingFilterChange = (nextFilter: BudgetingFilter) => {
    updateQueryParams({
      tab: "budgeting_quoting",
      subTab: nextFilter,
      page: "1",
    });
  };

  const handleSortToggle = () => {
    const nextSort = sortBy === "DESC" ? "ASC" : "DESC";

    updateQueryParams({
      sort: nextSort,
      page: "1",
    });
  };

  const handleNextPage = () => {
    if (safePage < totalPages) {
      updateQueryParams({
        page: String(safePage + 1),
      });
    }
  };

  const handlePrevPage = () => {
    if (safePage > 1) {
      updateQueryParams({
        page: String(safePage - 1),
      });
    }
  };

  const handlePageChange = (nextPage: number) => {
    const normalizedPage = Math.min(
      Math.max(Math.floor(nextPage), 1),
      Math.max(totalPages, 1),
    );

    if (normalizedPage === safePage) return;

    updateQueryParams({
      page: String(normalizedPage),
    });
  };

  const handleCampaignDeleted = () => {
    setCampaignReloadKey((value) => value + 1);
  };

  useEffect(() => {
    const handler = () => {
      setCampaignReloadKey((value) => value + 1);
    };

    window.addEventListener("app-data-refresh", handler);

    return () => {
      window.removeEventListener("app-data-refresh", handler);
    };
  }, []);

  //tabs
  const localizedTabItems = CAMPAIGN_TAB_ITEMS.map((item) => ({
    ...item,
    label: t(item.labelKey),
  }));

  //handle redirection
  const handleRedirectCreateCampaignPage = () => {
    router.push("/brand/create-campaign");
    setStep(1);
  };
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="grid lg:grid-cols-2 gap-4 items-center">
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 justify-between items-start">
            <div>
              <CardTitle className="truncate text-lg font-bold text-Primary">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-sm">
                {t("description")}
              </CardDescription>
            </div>

            <PrimaryButton
              type="button"
              className="sm:max-w-54"
              onClick={handleRedirectCreateCampaignPage}
            >
              {t("createNewCampaign")}
            </PrimaryButton>
          </div>

          <CampaignTabs
            items={localizedTabItems}
            activeTab={activeTab}
            activeCount={meta.total ?? data.length}
            onChange={handleTabChange}
          />
        </div>
      </CardHeader>

      <div className="border border-gray-100 w-full" />

      <CardContent>
        <CampaignToolbar
          title={t(TAB_TITLE[activeTab])}
          resultText={resultText}
          sortLabel={sortLabel}
          searchValue={searchInput}
          onSearch={setSearchInput}
          onSort={handleSortToggle}
        />

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <CampaignListSection
          tab={activeTab}
          campaigns={data}
          loading={loading}
          budgetingFilter={budgetingFilter}
          onBudgetingFilterChange={handleBudgetingFilterChange}
          onCampaignDeleted={handleCampaignDeleted}
        />

        <div className="mt-10">
          <PageFooterPagination
            page={safePage}
            totalPages={totalPages}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            onPageChange={handlePageChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
