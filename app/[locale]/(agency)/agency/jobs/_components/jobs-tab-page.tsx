"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const jobsSharedUiState: {
    search: string;
    sort: "low_budget" | "high_budget";
} = {
    search: "",
    sort: "low_budget",
};

const JobsTabPage = ({ tab, sectionTitle }: JobsTabPageProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Use refs so updatePageQueryParam never needs to be recreated
    const pathnameRef = useRef(pathname);
    const searchParamsRef = useRef(searchParams);
    pathnameRef.current = pathname;
    searchParamsRef.current = searchParams;

    const pageParam = Number(searchParams.get("page") || "1");
    const currentPage =
        Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

    const [searchInput, setSearchInput] = useState(jobsSharedUiState.search);
    const [sortValue, setSortValue] = useState<"low_budget" | "high_budget">(
        jobsSharedUiState.sort
    );

    const [offers, setOffers] = useState<NewJobOfferItem[]>([]);
    const [meta, setMeta] = useState<NewJobOffersResponse["meta"]>({
        total: 0,
        page: 1,
        limit: PAGE_SIZE,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);

    // Stable function — never recreated, reads latest values via refs
    const updatePageQueryParam = useCallback(
        (page: string | null) => {
            const params = new URLSearchParams(searchParamsRef.current.toString());

            if (!page || page === "1") {
                params.delete("page");
            } else {
                params.set("page", page);
            }

            const query = params.toString();
            router.replace(
                query ? `${pathnameRef.current}?${query}` : pathnameRef.current,
                { scroll: false }
            );
        },
        [router]
    );

    useEffect(() => {
        setSearchInput(jobsSharedUiState.search);
        setSortValue(jobsSharedUiState.sort);
    }, [tab]);

    useEffect(() => {
        jobsSharedUiState.search = searchInput;
    }, [searchInput]);

    useEffect(() => {
        jobsSharedUiState.sort = sortValue;
    }, [sortValue]);

    useEffect(() => {
        const handler = () => {
            setNotificationRefreshKey((value) => value + 1);
        };

        window.addEventListener("app-data-refresh", handler);

        return () => {
            window.removeEventListener("app-data-refresh", handler);
        };
    }, []);

    // Reset to page 1 only when search or sort changes — NOT on page changes
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timer = setTimeout(() => {
            updatePageQueryParam("1");
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput, sortValue]); // eslint-disable-line react-hooks/exhaustive-deps

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
                    search: searchInput,
                    sort: sortValue,
                });

                if (!mounted) return;

                setOffers(response.data);
                setMeta({
                    total: response.meta.total,
                    page: currentPage,
                    limit: response.meta.limit,
                    totalPages: response.meta.totalPages,
                });
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
    }, [currentPage, searchInput, sortValue, tab, notificationRefreshKey]);

    const showingCount = useMemo(() => {
        const previousCount = (currentPage - 1) * PAGE_SIZE;
        return previousCount + offers.length;
    }, [currentPage, offers.length]);

    const handleSortToggle = () => {
        setSortValue((prev) =>
            prev === "low_budget" ? "high_budget" : "low_budget"
        );
        if (currentPage !== 1) {
            updatePageQueryParam("1");
        }
    };

    const handlePageChange = (nextPage: number) => {
        if (nextPage < 1 || nextPage > meta.totalPages) return;
        updatePageQueryParam(String(nextPage));
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
                        sortValue={sortValue}
                        onSortToggle={handleSortToggle}
                    />

                    <NewOfferList
                        tab={tab}
                        items={offers}
                        loading={loading}
                        error={error}
                        page={currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default JobsTabPage;