"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Search, SquarePen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { AgencyNicheItem, AgencyProfileResponse } from "@/types/agency/account-settings";
import {
  getAgencyNicheOptions,
  updateAgencyNiches,
} from "@/service/agency/account-settings";
import { notifyError, notifySuccess } from "@/utils/toast_util";

type NicheCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
  onProfileUpdated: (updatedProfile: AgencyProfileResponse) => void;
};

type SelectableItem = {
  id: string;
  name: string;
};

const NicheCard = ({
  profile,
  isLoading,
  onProfileUpdated,
}: NicheCardProps) => {
  const [niches, setNiches] = useState<AgencyNicheItem[]>([]);
  const [nicheOptions, setNicheOptions] = useState<SelectableItem[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingNiche, setDeletingNiche] = useState<string | null>(null);
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);

  useEffect(() => {
    setNiches(profile?.niches ?? []);
  }, [profile?.niches]);

  const fetchNicheOptions = async () => {
    try {
      setIsOptionsLoading(true);
      const options = await getAgencyNicheOptions();
      setNicheOptions(options);
    } catch (error: any) {
      notifyError(error?.response?.data?.message || "Failed to load niches");
    } finally {
      setIsOptionsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setSelectedNiches(niches.map((item) => item.niche));
    setSearchQuery("");
    setOpen(true);
    void fetchNicheOptions();
  };

  const mergedNicheOptions = useMemo(() => {
    const optionMap = new Map<string, SelectableItem>();

    nicheOptions.forEach((item) => {
      optionMap.set(item.name.toLowerCase(), item);
    });

    niches.forEach((item) => {
      if (!optionMap.has(item.niche.toLowerCase())) {
        optionMap.set(item.niche.toLowerCase(), {
          id: item.niche,
          name: item.niche,
        });
      }
    });

    return Array.from(optionMap.values());
  }, [nicheOptions, niches]);

  const filteredNicheOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return mergedNicheOptions;

    return mergedNicheOptions.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }, [mergedNicheOptions, searchQuery]);

  const toggleNiche = (nicheName: string) => {
    setSelectedNiches((current) =>
      current.includes(nicheName)
        ? current.filter((item) => item !== nicheName)
        : [...current, nicheName]
    );
  };

  const buildMergedProfile = (
    baseProfile: AgencyProfileResponse,
    finalNiches: string[],
    updatedProfile?: AgencyProfileResponse
  ): AgencyProfileResponse => ({
    ...baseProfile,
    ...(updatedProfile ?? {}),
    niches: finalNiches.map((niche) => {
      const existingNiche = baseProfile.niches?.find(
        (item) => item.niche.toLowerCase() === niche.toLowerCase()
      );

      return {
        niche,
        status: existingNiche?.status ?? "pending",
        rejectReason: existingNiche?.rejectReason,
      };
    }),
  });

  const handleSaveNiches = async () => {
    if (!profile) return;

    if (selectedNiches.length === 0) {
      notifyError("At least one niche is required");
      return;
    }

    const previousNiches = [...niches];
    const nextNiches = selectedNiches.map((niche) => {
      const existingNiche = niches.find((item) => item.niche === niche);
      return existingNiche ?? { niche, status: "pending" as const };
    });

    try {
      setIsSubmitting(true);
      setNiches(nextNiches);
      setOpen(false);

      const updatedProfile = await updateAgencyNiches({ niches: selectedNiches });
      onProfileUpdated(buildMergedProfile(profile, selectedNiches, updatedProfile));
      notifySuccess("Niches updated successfully");
    } catch (error: any) {
      setNiches(previousNiches);
      setOpen(true);
      notifyError(error?.response?.data?.message || "Failed to update niches");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveNiche = async (nicheToRemove: string) => {
    if (!profile) return;

    const previousNiches = [...niches];
    const updatedNiches = niches.filter((item) => item.niche !== nicheToRemove);
    const nicheNames = updatedNiches.map((item) => item.niche);

    try {
      setDeletingNiche(nicheToRemove);
      setNiches(updatedNiches);

      const updatedProfile = await updateAgencyNiches({ niches: nicheNames });
      onProfileUpdated(buildMergedProfile(profile, nicheNames, updatedProfile));
      notifySuccess("Niche removed successfully");
    } catch (error: any) {
      setNiches(previousNiches);
      notifyError(error?.response?.data?.message || "Failed to remove niche");
    } finally {
      setDeletingNiche(null);
    }
  };

  return (
    <Card className="h-full">
      <div className="flex h-full min-h-[230px] flex-col px-4 py-4">
        <div className="mb-4 flex min-h-6 items-center justify-between gap-2 text-md font-semibold text-Primary">
          <p className="flex items-center gap-2">Niche</p>
          <SquarePen size={18} className="text-Primary" />
        </div>

        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#9DB47B] border-t-transparent" />
            </div>
          ) : niches.length === 0 ? (
            <p className="mb-6 text-sm text-gray-500">No niches found.</p>
          ) : (
            <div className="mb-6 flex flex-wrap gap-2">
              {niches.map((item, index) => {
                const isPending = item.status === "pending";

                return (
                  <span
                    key={`${item.niche}-${index}`}
                    className="flex items-center gap-1 rounded-full bg-[#F1F6DE] px-3 py-1 text-sm text-[#2D5016]"
                  >
                    {item.niche}
                    {isPending ? (
                      <Clock3 className="h-3 w-3 text-[#E57A1F]" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3 text-[#078834]" />
                    )}
                    <button
                      type="button"
                      onClick={() => void handleRemoveNiche(item.niche)}
                      className="ml-1 rounded-full p-0.5 hover:bg-[#2D5016]/10 disabled:opacity-50"
                      disabled={deletingNiche === item.niche}
                    >
                      {deletingNiche === item.niche ? (
                        <div className="h-3 w-3 animate-spin rounded-full border border-[#2D5016] border-t-transparent" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={handleOpenDialog}
          className="mt-auto w-full rounded-lg border border-dashed border-[#9DB47B] py-2 text-sm text-[#2D5016] hover:bg-[#F7FAEC] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading || !profile}
          type="button"
        >
          + Add another Niche
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[430px] rounded-xl p-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#2D5016]">
              Niche
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search Niche"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 rounded-xl pl-10"
              />
            </div>

            <div className="min-h-[120px] rounded-xl border p-3">
              {isOptionsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#9DB47B] border-t-transparent" />
                </div>
              ) : filteredNicheOptions.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  No niches found
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredNicheOptions.map((item) => {
                    const isSelected = selectedNiches.includes(item.name);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleNiche(item.name)}
                        className={`rounded-full px-3 py-1.5 text-xs transition ${
                          isSelected
                            ? "bg-[#F1F6DE] text-[#2D5016]"
                            : "bg-gray-100 text-[#2D5016] hover:bg-[#F7FAEC]"
                        }`}
                      >
                        {item.name}
                        {isSelected && <X className="ml-2 inline h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => void handleSaveNiches()}
              disabled={isSubmitting || isOptionsLoading}
              className="w-full bg-[#7A9A55] text-white hover:bg-[#6C894B]"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default NicheCard;
