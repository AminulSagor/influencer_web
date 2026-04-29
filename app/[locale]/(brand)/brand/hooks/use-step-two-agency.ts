"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { serviceClient } from "@/service/base/axios_client";
import { CampaignService } from "@/service/campaign/campaign-service";
import { notifyError } from "@/utils/toast_util";
import {
  Agency,
  AgencyApiItem,
  AgencyListResponse,
  FieldErrors,
} from "@/types/campaign/step2_campaign_type";
import { CampaignServiceAgency } from "@/service/campaign/agency/update-step-2";

type AgencyListSetter = Dispatch<SetStateAction<Agency[]>>;

type FetchAgencyPageParams = {
  page: number;
  search?: string;
  niche?: string;
  append: boolean;
  setList: AgencyListSetter;
  setHasMore: (value: boolean) => void;
  setLoading: (value: boolean) => void;
};

export const useStepTwoAgency = () => {
  const { increaseStep, decreaseStep } = useCampaignStore();
  const campaignId = useCampaignStore((s) => s.campaignId);

  const [campaignNiches, setCampaignNiches] = useState<string[]>([]);
  const [campaignNiche, setCampaignNicheState] = useState("");

  const [selectedAgencies, setSelectedAgencies] = useState<Agency[]>([]);
  const [agencyInput, setAgencyInput] = useState("");
  const [agencySuggestions, setAgencySuggestions] = useState<Agency[]>([]);

  const [recommendedAgencies, setRecommendedAgencies] = useState<Agency[]>([]);
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [recommendedHasMore, setRecommendedHasMore] = useState(true);
  const [loadingRecommendedAgencies, setLoadingRecommendedAgencies] =
    useState(false);

  const [otherAgencies, setOtherAgencies] = useState<Agency[]>([]);
  const [otherPage, setOtherPage] = useState(1);
  const [otherHasMore, setOtherHasMore] = useState(true);
  const [loadingOtherAgencies, setLoadingOtherAgencies] = useState(false);

  const limit = 10;
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const fetchCampaignNiches = async () => {
      try {
        const niches = await CampaignService.getCampaignNiches();
        setCampaignNiches(niches);
      } catch (err: any) {
        notifyError(err.message || "Failed to fetch campaign niches");
      }
    };

    fetchCampaignNiches();
  }, []);

  const fetchAgencyPage = useCallback(
    async ({
      page,
      search,
      niche,
      append,
      setList,
      setHasMore,
      setLoading,
    }: FetchAgencyPageParams) => {
      setLoading(true);

      try {
        const trimmedSearch = search?.trim();
        const trimmedNiche = niche?.trim();

        const response = await serviceClient.get<AgencyListResponse>(
          "/client/agencies",
          {
            params: {
              page,
              limit,
              ...(trimmedSearch ? { search: trimmedSearch } : {}),
              ...(trimmedNiche ? { niche: trimmedNiche } : {}),
            },
          },
        );

        const items = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        const mappedAgencies = items.map(mapAgency);

        setList((prev) => {
          if (!append) return mappedAgencies;

          const map = new Map(prev.map((item) => [item.id, item]));

          for (const agency of mappedAgencies) {
            map.set(agency.id, agency);
          }

          return Array.from(map.values());
        });

        const totalPages = Number(response.data?.meta?.totalPages ?? 0);

        if (totalPages > 0) {
          setHasMore(page < totalPages);
        } else {
          setHasMore(mappedAgencies.length === limit);
        }
      } catch (err) {
        console.error("Failed to fetch agencies:", err);
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    let isCancelled = false;

    const fetchRecommendedAgencies = async () => {
      if (isCancelled) return;

      if (!campaignNiche.trim()) {
        setRecommendedAgencies([]);
        setRecommendedHasMore(false);
        setLoadingRecommendedAgencies(false);
        return;
      }

      await fetchAgencyPage({
        page: recommendedPage,
        niche: campaignNiche,
        append: recommendedPage > 1,
        setList: (updater) => {
          if (!isCancelled) setRecommendedAgencies(updater);
        },
        setHasMore: (value) => {
          if (!isCancelled) setRecommendedHasMore(value);
        },
        setLoading: (value) => {
          if (!isCancelled) setLoadingRecommendedAgencies(value);
        },
      });
    };

    fetchRecommendedAgencies();

    return () => {
      isCancelled = true;
    };
  }, [campaignNiche, fetchAgencyPage, recommendedPage]);

  useEffect(() => {
    let isCancelled = false;

    const fetchOtherAgencies = async () => {
      if (isCancelled) return;

      await fetchAgencyPage({
        page: otherPage,
        append: otherPage > 1,
        setList: (updater) => {
          if (!isCancelled) setOtherAgencies(updater);
        },
        setHasMore: (value) => {
          if (!isCancelled) setOtherHasMore(value);
        },
        setLoading: (value) => {
          if (!isCancelled) setLoadingOtherAgencies(value);
        },
      });
    };

    fetchOtherAgencies();

    return () => {
      isCancelled = true;
    };
  }, [fetchAgencyPage, otherPage]);

  const loadingAgencies = useMemo(
    () => loadingRecommendedAgencies || loadingOtherAgencies,
    [loadingOtherAgencies, loadingRecommendedAgencies],
  );

  const hasMore = useMemo(
    () => recommendedHasMore || otherHasMore,
    [otherHasMore, recommendedHasMore],
  );

  const setCampaignNiche = useCallback((value: string) => {
    setCampaignNicheState(value);
    setRecommendedAgencies([]);
    setRecommendedPage(1);
    setRecommendedHasMore(true);
    setAgencySuggestions([]);
  }, []);

  const clearError = (key: keyof FieldErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const searchAgencies = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setAgencySuggestions([]);
        return;
      }

      try {
        const response = await serviceClient.get<AgencyListResponse>(
          "/client/agencies",
          {
            params: {
              page: 1,
              limit,
              search: query.trim(),
              ...(campaignNiche.trim() ? { niche: campaignNiche.trim() } : {}),
            },
          },
        );

        const items = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        setAgencySuggestions(items.map(mapAgency));
      } catch (err) {
        console.error("Agency search failed:", err);
      }
    },
    [campaignNiche, limit],
  );

  const validateAll = () => {
    const nextErrors: FieldErrors = {};

    if (!campaignNiche) {
      nextErrors.campaignNiche = "Please select a campaign niche.";
    }

    if (selectedAgencies.length === 0) {
      nextErrors.selectedAgencies = "Select at least 1 agency.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const addAgency = (agency: Agency) => {
    const exists = selectedAgencies.some((item) => item.id === agency.id);

    if (!exists) {
      setSelectedAgencies((prev) => [...prev, agency]);
    }

    setAgencyInput("");
    setAgencySuggestions([]);
    clearError("selectedAgencies");
  };

  const removeAgency = (agencyId: string) => {
    setSelectedAgencies((prev) => prev.filter((item) => item.id !== agencyId));
  };

  const loadMoreRecommendedAgencies = useCallback(() => {
    if (recommendedHasMore && !loadingRecommendedAgencies) {
      setRecommendedPage((prev) => prev + 1);
    }
  }, [loadingRecommendedAgencies, recommendedHasMore]);

  const loadMoreOtherAgencies = useCallback(() => {
    if (otherHasMore && !loadingOtherAgencies) {
      setOtherPage((prev) => prev + 1);
    }
  }, [loadingOtherAgencies, otherHasMore]);

  const loadMoreAgencies = useCallback(() => {
    loadMoreOtherAgencies();
  }, [loadMoreOtherAgencies]);

  const onNext = async () => {
    if (!campaignId) {
      notifyError("Campaign ID is missing.");
      return;
    }

    if (!validateAll()) return;

    try {
      await CampaignServiceAgency.updateStepTwo(campaignId, {
        campaignNiche,
        agencyId: selectedAgencies.map((item) => item.id),
      });

      increaseStep();
    } catch (err: any) {
      notifyError(err.message || "Failed to save step 2");
      console.error(err);
    }
  };

  const onPrevious = () => {
    decreaseStep();
  };

  return {
    campaignNiches,
    campaignNiche,
    agencyInput,
    agencySuggestions,
    selectedAgencies,
    recommendedAgencies,
    otherAgencies,
    hasMore,
    loadingAgencies,
    recommendedHasMore,
    otherHasMore,
    loadingRecommendedAgencies,
    loadingOtherAgencies,
    errors,
    setCampaignNiche,
    setAgencyInput,
    setAgencySuggestions,
    setSelectedAgencies,
    clearError,
    searchAgencies,
    addAgency,
    removeAgency,
    loadMoreAgencies,
    loadMoreRecommendedAgencies,
    loadMoreOtherAgencies,
    onNext,
    onPrevious,
  };
};

const mapAgency = (agency: AgencyApiItem): Agency => {
  return {
    id: agency.id,
    name: agency.agencyName,
    subtitle: agency.fullName,
  };
};
