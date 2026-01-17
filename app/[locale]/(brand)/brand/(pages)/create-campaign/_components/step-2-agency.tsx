"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { useToken } from "@/hooks/useGetToken";
import axiosInstance from "@/lib/axios";
import { CAMPAIGN_NICHES } from "@/app/[locale]/(brand)/brand/dummy-data/niche-and-productType-data";
import { Info } from "lucide-react";

/* ================= Types ================= */

type Agency = {
  id: string;
  name: string;
  subtitle: string;
};

type FieldErrors = Partial<
  Record<"productType" | "campaignNiche" | "preferred" | "notPreferred", string>
>;

/* ================= Component ================= */

export default function StepTwoAgency() {
  const { increaseStep, decreaseStep } = useCampaignStore();
  const { token } = useToken();

  const [CAMPAIGN_NICHESS, set_CAMPAIGN_NICHES] = useState<string[]>([]);
  const [campaignNiche, setCampaignNiche] = useState<string>("");

  const [errors, setErrors] = useState<FieldErrors>({});

  /* ===== Pagination States ===== */
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const [loadingAgencies, setLoadingAgencies] = useState(false);

  /* ================= Fetch Niches ================= */

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const res = await axiosInstance.get("/campaign/get/niches", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200 && Array.isArray(res.data)) {
          const niches = res.data.map((v: { name: string }) => v.name);
          set_CAMPAIGN_NICHES(niches);
        }
      } catch {
        set_CAMPAIGN_NICHES(CAMPAIGN_NICHES);
      }
    })();
  }, [token]);

  /* ================= Fetch Agencies (Pagination) ================= */

  useEffect(() => {
    if (!token || !hasMore) return;

    const fetchAgencies = async () => {
      setLoadingAgencies(true);
      try {
        const res = await axiosInstance.get("/client/agencies", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page,
            limit,
          },
        });

        const newAgencies: Agency[] = res.data?.data || [];

        setAgencies((prev) => [...prev, ...newAgencies]);

        if (newAgencies.length < limit) {
          setHasMore(false); // no more pages
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingAgencies(false);
      }
    };

    fetchAgencies();
  }, [page, token, hasMore]);

  /* ================= Validation ================= */

  const clearError = (key: keyof FieldErrors) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  /* ================= UI ================= */

  return (
    <Card className="border-none">
      <CardContent className="p-4 space-y-5">
        {/* ================= Campaign Niche ================= */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-Primary">
              Campaign Niche
            </h2>
            <Info className="w-4 h-4 text-gray-400" />
          </div>

          <Select
            value={campaignNiche}
            onValueChange={(v) => {
              setCampaignNiche(v);
              clearError("campaignNiche");
            }}
          >
            <SelectTrigger
              className={[
                "focus-visible:ring-1 w-full",
                errors.campaignNiche ? "border-red-500" : "",
              ].join(" ")}
            >
              <SelectValue placeholder="Select Niche Type" />
            </SelectTrigger>

            <SelectContent className="max-h-64">
              {CAMPAIGN_NICHESS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.campaignNiche && (
            <p className="text-sm text-red-500">{errors.campaignNiche}</p>
          )}
        </div>

        {/* ================= Recommended Agencies (Horizontal Infinite Scroll) ================= */}

        <div>
          <h1 className="text-Primary font-semibold">
            Recommended Ad Agencies
          </h1>

          <div
            className="mt-3 flex gap-3 overflow-x-auto pb-2"
            onScroll={(e) => {
              const el = e.currentTarget;

              if (
                el.scrollLeft + el.clientWidth >= el.scrollWidth - 20 &&
                hasMore &&
                !loadingAgencies
              ) {
                setPage((p) => p + 1);
              }
            }}
          >
            {agencies.map((a) => (
              <AgencyCard key={a.id} agency={a} />
            ))}
          </div>
        </div>

        {/* ================= Other Agencies (Vertical Scroll) ================= */}

        <div>
          <h1 className="text-Primary font-semibold">Other Add Agencies</h1>

          <div className="max-h-72 overflow-x-auto flex flex-col gap-3 mt-3">
            {agencies.map((a) => (
              <AgencyCard2 key={a.id} agency={a} />
            ))}
          </div>
        </div>

        {/* ================= Footer Buttons ================= */}

        <div className="mt-10 flex justify-end">
          <div className="flex gap-4">
            <SecondaryButton onClick={() => decreaseStep()}>
              Previous
            </SecondaryButton>

            <PrimaryButton className="px-8" onClick={() => increaseStep()}>
              Next
            </PrimaryButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ================= Cards ================= */

function AgencyCard({ agency }: { agency: Agency }) {
  return (
    <Card
      className={clsx(
        "border-none rounded-2xl overflow-hidden shrink-0",
        "w-[210px]",
        "bg-linear-to-r from-Primary to-light-green"
      )}
    >
      <CardContent className="h-full flex flex-col items-center justify-center">
        <div className="h-18 w-18 rounded-full bg-linear-to-br from-white/70 to-light-green/40 shadow-inner" />

        <div className="mt-4 text-center">
          <p className="text-white font-semibold text-lg leading-tight">
            {agency.name}
          </p>
          <p className="text-white/80 text-sm">{agency.subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AgencyCard2({ agency }: { agency: Agency }) {
  return (
    <Card
      className={clsx(
        "border-none rounded-2xl overflow-hidden shrink-0",
        "w-full",
        "bg-linear-to-r from-Primary to-light-green"
      )}
    >
      <CardContent className="flex items-center gap-4">
        <div className="h-15 w-15 rounded-full bg-linear-to-br from-white/70 to-light-green/40 shadow-inner" />

        <div className="text-center">
          <p className="text-white font-semibold text-lg leading-tight">
            {agency.name}
          </p>
          <p className="text-white/80 text-sm">{agency.subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}