"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import clsx from "clsx";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { Info, X } from "lucide-react";
import { apiClient } from "@/api/base/axios_client";
import { campaignServiceAgency } from "@/api/campaign/agency/update-step-2";

type FieldErrors = Partial<Record<"campaignNiche" | "selectedAgencies", string>>;

type Agency = {
  id: string;
  name: string;
  subtitle: string;
};

export default function StepTwoAgency() {
  const { increaseStep, decreaseStep } = useCampaignStore();
  const campaignId = useCampaignStore((s) => s.campaignId);

  // ================== States ==================
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

  // ================= Fetch Campaign Niches =================
  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get("/campaign/get/niches");
        if (res.status === 200 && Array.isArray(res.data)) {
          const niches = res.data.map((n: { name: string }) => n.name);
          setCampaignNiches(niches);
        }
      } catch {
        console.error("Failed to fetch campaign niches");
      }
    })();
  }, []);

  // ================= Fetch Agencies (Pagination) =================
  useEffect(() => {
    const fetchAgencies = async () => {
      if (!hasMore || loadingAgencies) return;
      setLoadingAgencies(true);
      try {
        const res = await apiClient.get("/client/agencies", { params: { page, limit } });
        const newAgencies: Agency[] = res.data?.data || [];
        setAllAgencies((prev) => [...prev, ...newAgencies]);
        if (newAgencies.length < limit) setHasMore(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAgencies(false);
      }
    };
    fetchAgencies();
  }, [page]);

  // ================= Search Agencies =================
  const searchAgencies = async (query: string) => {
    if (!query.trim()) return;
    try {
      const res = await apiClient.get("/client/agencies", { params: { page: 1, limit: 30, search: query } });
      const data: Agency[] = res.data?.data || [];
      setAgencySuggestions(data);
    } catch (err) {
      console.error("Agency search failed:", err);
    }
  };

  // ================= Validation =================
  const clearError = (key: keyof FieldErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateAll = () => {
    const nextErrors: FieldErrors = {};
    if (!campaignNiche) nextErrors.campaignNiche = "Please select a campaign niche.";
    if (selectedAgencies.length === 0) nextErrors.selectedAgencies = "Select at least 1 agency.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // ================= Submit =================
  const onNext = async () => {
    if (!validateAll()) return;
    try {
      await campaignServiceAgency.updateStepTwo(campaignId, {
        campaignNiche,
        agencyId: selectedAgencies.map((a) => a.id),
      });
      increaseStep();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save step 2");
    }
  };

  // ================= UI Helpers =================
  const addAgency = (agency: Agency) => {
    if (!selectedAgencies.find((a) => a.id === agency.id)) setSelectedAgencies([...selectedAgencies, agency]);
    setAgencyInput("");
    setAgencySuggestions([]);
    clearError("selectedAgencies");
  };

  return (
    <Card className="border-none">
      <CardContent className="space-y-6">
        {/* Campaign Niche */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-Primary">Campaign Niche</h2>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <Select
            value={campaignNiche}
            onValueChange={(v) => { setCampaignNiche(v); clearError("campaignNiche"); }}
          >
            <SelectTrigger className={`w-full focus-visible:ring-1 ${errors.campaignNiche ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Select Niche Type" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {campaignNiches.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.campaignNiche && <p className="text-sm text-red-500">{errors.campaignNiche}</p>}
        </div>

        {/* Agency Search Input */}
        <div className="space-y-2 relative">
          <input
            value={agencyInput}
            onChange={(e) => { setAgencyInput(e.target.value); searchAgencies(e.target.value); }}
            placeholder="Search agency..."
            className="w-full h-12 border rounded px-3 focus-visible:ring-1"
          />
          {agencySuggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-60 overflow-auto">
              {agencySuggestions.map((a) => (
                <li key={a.id} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => addAgency(a)}>
                  {a.name}
                </li>
              ))}
            </ul>
          )}
          {errors.selectedAgencies && <p className="text-sm text-red-500">{errors.selectedAgencies}</p>}
        </div>

        {/* Selected Agencies Tags */}
        <div className="flex flex-wrap gap-2">
          {selectedAgencies.map((a) => (
            <span key={a.id} className="flex items-center gap-1 bg-Secondary text-Primary px-3 py-1 rounded-full text-sm">
              {a.name}
              <button onClick={() => setSelectedAgencies(selectedAgencies.filter((s) => s.id !== a.id))}>
                <X className="w-3.5 h-3.5 cursor-pointer" />
              </button>
            </span>
          ))}
        </div>

        {/* Recommended Agencies (Horizontal Scroll) */}
        <div>
          <h1 className="text-Primary font-semibold">Recommended Ad Agencies</h1>
          <div
            className="mt-3 flex gap-3 overflow-x-auto pb-2"
            onScroll={(e) => {
              const el = e.currentTarget;
              if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 20 && hasMore && !loadingAgencies) {
                setPage((p) => p + 1);
              }
            }}
          >
            {allAgencies.map((a) => (
              <AgencyCard key={a.id} agency={a} onClick={() => addAgency(a)} />
            ))}
          </div>
        </div>

        {/* Other Agencies (Vertical Scroll) */}
        <div>
          <h1 className="text-Primary font-semibold">Other Ad Agencies</h1>
          <div className="max-h-72 overflow-x-auto flex flex-col gap-3 mt-3">
            {allAgencies.map((a) => (
              <AgencyCard2 key={a.id} agency={a} onClick={() => addAgency(a)} />
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <SecondaryButton onClick={decreaseStep}>Previous</SecondaryButton>
          <PrimaryButton onClick={onNext}>Next</PrimaryButton>
        </div>
      </CardContent>
    </Card>
  );
}

/* ================= Agency Cards ================= */
function AgencyCard({ agency, onClick }: { agency: Agency; onClick: () => void }) {
  return (
    <Card
      className={clsx("border-none rounded-2xl overflow-hidden shrink-0 w-[210px]", "bg-linear-to-r from-Primary to-light-green", "cursor-pointer")}
      onClick={onClick}
    >
      <CardContent className="h-full flex flex-col items-center justify-center">
        <div className="h-18 w-18 rounded-full bg-linear-to-br from-white/70 to-light-green/40 shadow-inner" />
        <div className="mt-4 text-center">
          <p className="text-white font-semibold text-lg leading-tight">{agency.name}</p>
          <p className="text-white/80 text-sm">{agency.subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AgencyCard2({ agency, onClick }: { agency: Agency; onClick: () => void }) {
  return (
    <Card
      className={clsx("border-none rounded-2xl overflow-hidden shrink-0 w-full", "bg-linear-to-r from-Primary to-light-green", "cursor-pointer")}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4">
        <div className="h-15 w-15 rounded-full bg-linear-to-br from-white/70 to-light-green/40 shadow-inner" />
        <div className="text-center">
          <p className="text-white font-semibold text-lg leading-tight">{agency.name}</p>
          <p className="text-white/80 text-sm">{agency.subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}
