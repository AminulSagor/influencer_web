"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import ButtonLinks from "./button-links";
import NewOfferSearch from "./new-offer-search";
import NewOfferList from "./new-offer-list";
import {
    getNewJobOffers,
    type JobTab,
} from "@/service/agency/new-job-offers";
import type {
    NewJobOfferItem,
    NewJobOffersResponse,
} from "@/types/agency/new-job-offers";

type JobsTabPageProps = {
    tab: JobTab;
    sectionTitle: string;
};

const PAGE_SIZE = 6;

const JobsTabPage = ({ tab, sectionTitle }: JobsTabPageProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const pageParam = Number(searchParams.get("page") || "1");
    const currentPage =
        Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

    const currentSearch = searchParams.get("search") || "";
    const currentSort =
        searchParams.get("sort") === "high_budget" ? "high_budget" : "low_budget";

    const [searchInput, setSearchInput] = useState(currentSearch);
    const [offers, setOffers] = useState<NewJobOfferItem[]>([]);
    const [meta, setMeta] = useState<NewJobOffersResponse["meta"]>({
        total: 0,
        page: 1,
        limit: PAGE_SIZE,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const updateQueryParams = useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (!value) {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });

            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
            });
        },
        [pathname, router, searchParams]
    );

    useEffect(() => {
        setSearchInput(currentSearch);
    }, [currentSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput.trim() === currentSearch.trim()) return;

            updateQueryParams({
                search: searchInput.trim() || null,
                page: "1",
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput, currentSearch, updateQueryParams]);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getNewJobOffers({
                    page: currentPage,
                    limit: PAGE_SIZE,
                    tab,
                    search: currentSearch,
                    sort: currentSort,
                });

                if (!mounted) return;

                setOffers(response.data);
                setMeta(response.meta);
            } catch {
                if (!mounted) return;

                setOffers([]);
                setError("Failed to load job offers.");
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, [currentPage, currentSearch, currentSort, tab]);

    const showingCount = useMemo(() => {
        const previousCount = (meta.page - 1) * PAGE_SIZE;
        return previousCount + offers.length;
    }, [meta.page, offers.length]);

    const handleSortToggle = () => {
        updateQueryParams({
            sort: currentSort === "low_budget" ? "high_budget" : "low_budget",
            page: "1",
        });
    };

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1 || nextPage > meta.totalPages) return;

        updateQueryParams({
            page: String(nextPage),
        });
    };

    return (
        <div className="p-4">
            <Card>
                <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold text-Primary">
                            Job Marketplace
                        </CardTitle>
                        <CardDescription>Browse and manage your job offers</CardDescription>
                    </div>

                    <div className="w-full sm:w-auto">
                        <ButtonLinks />
                    </div>
                </CardHeader>

                <CardContent className="space-y-8 pt-4">
                    <NewOfferSearch
                        title={sectionTitle}
                        searchValue={searchInput}
                        onSearchChange={setSearchInput}
                        showingCount={showingCount}
                        totalCount={meta.total}
                        sortValue={currentSort}
                        onSortToggle={handleSortToggle}
                    />

                    <NewOfferList
                        items={offers}
                        loading={loading}
                        error={error}
                        page={meta.page}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default JobsTabPage;