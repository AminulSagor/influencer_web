"use client";

import { useEffect, useMemo, useState } from "react";
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

export const useStepTwoAgency = () => {
  const { increaseStep, decreaseStep } = useCampaignStore();
  const campaignId = useCampaignStore((s) => s.campaignId);

  const [campaignNiches, setCampaignNiches] = useState<string[]>([]);
  const [campaignNiche, setCampaignNiche] = useState("");

  const [selectedAgencies, setSelectedAgencies] = useState<Agency[]>([]);
  const [agencyInput, setAgencyInput] = useState("");
  const [agencySuggestions, setAgencySuggestions] = useState<Agency[]>([]);

  const [allAgencies, setAllAgencies] = useState<Agency[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loadingAgencies, setLoadingAgencies] = useState(false);

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

  useEffect(() => {
    const fetchAgencies = async () => {
      if (!hasMore || loadingAgencies) return;

      setLoadingAgencies(true);

      try {
        const response = await serviceClient.get<AgencyListResponse>(
          "/client/agencies",
          {
            params: { page, limit },
          },
        );

        const items = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        const mappedAgencies = items.map(mapAgency);

        setAllAgencies((prev) => {
          const map = new Map(prev.map((item) => [item.id, item]));

          for (const agency of mappedAgencies) {
            map.set(agency.id, agency);
          }

          return Array.from(map.values());
        });

        if (mappedAgencies.length < limit) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to fetch agencies:", err);
      } finally {
        setLoadingAgencies(false);
      }
    };

    fetchAgencies();
  }, [page, limit, hasMore, loadingAgencies]);

  const recommendedAgencies = useMemo(
    () => allAgencies.slice(0, 5),
    [allAgencies],
  );
  const otherAgencies = useMemo(() => allAgencies.slice(5), [allAgencies]);

  const clearError = (key: keyof FieldErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const searchAgencies = async (query: string) => {
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
            limit: 30,
            search: query,
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
  };

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

  const loadMoreAgencies = () => {
    if (hasMore && !loadingAgencies) {
      setPage((prev) => prev + 1);
    }
  };

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
