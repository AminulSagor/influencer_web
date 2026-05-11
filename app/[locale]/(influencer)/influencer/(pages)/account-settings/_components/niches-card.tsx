"use client";

import CollapseCard from "@/app/[locale]/(influencer)/influencer/_component/collapse-card";
import { CheckCircle2, Clock3, Search, SquarePen, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getInfluencerNicheOptions,
  getInfluencerProfile,
  updateInfluencerNiches,
} from "@/service/influencer/profile/profile";
import { toast } from "sonner";
import { Niche } from "@/types/influencer/account_setting/profile_type";
import { nichesUpdateSchema } from "@/schemas/influencer/niches-validation";

type SelectableItem = {
  id: string;
  name: string;
};

export default function NichesCard() {
  const t = useTranslations("influencer.account-setting");
  const [niches, setNiches] = useState<Niche[]>([]);
  const [nicheOptions, setNicheOptions] = useState<SelectableItem[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingNiche, setDeletingNiche] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profile = await getInfluencerProfile();
      setNiches(profile.niches ?? []);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = () => {
      void fetchProfile();
    };

    window.addEventListener("app-data-refresh", handler);

    return () => {
      window.removeEventListener("app-data-refresh", handler);
    };
  }, []);


  const fetchNicheOptions = async () => {
    try {
      setIsOptionsLoading(true);
      const options = await getInfluencerNicheOptions();
      setNicheOptions(options);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load niches");
    } finally {
      setIsOptionsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setSelectedNiches(niches.map((item) => item.niche));
    setSearchQuery("");
    setOpen(true);
    fetchNicheOptions();
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
      item.name.toLowerCase().includes(query),
    );
  }, [mergedNicheOptions, searchQuery]);

  const toggleNiche = (nicheName: string) => {
    setSelectedNiches((current) =>
      current.includes(nicheName)
        ? current.filter((item) => item !== nicheName)
        : [...current, nicheName],
    );
  };

  const handleSaveNiches = async () => {
    const parsed = nichesUpdateSchema.safeParse({ niches: selectedNiches });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid niches");
      return;
    }

    const previousNiches = [...niches];
    const nextNiches = selectedNiches.map((niche) => {
      const existingNiche = niches.find((item) => item.niche === niche);
      return existingNiche ?? { niche, status: "unverified" as const };
    });

    try {
      setIsSubmitting(true);
      setNiches(nextNiches);
      setOpen(false);

      const response = await updateInfluencerNiches({ niches: selectedNiches });
      toast.success(response.message || "Niches updated successfully");
      await fetchProfile();
    } catch (error: any) {
      setNiches(previousNiches);
      setOpen(true);
      toast.error(error?.response?.data?.message || "Failed to update niches");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveNiche = async (nicheToRemove: string) => {
    const previousNiches = [...niches];
    const updatedNiches = niches.filter((item) => item.niche !== nicheToRemove);
    const nicheNames = updatedNiches.map((item) => item.niche);

    try {
      setDeletingNiche(nicheToRemove);
      setNiches(updatedNiches);

      const response = await updateInfluencerNiches({ niches: nicheNames });
      toast.success(response.message || "Niche removed successfully");
      await fetchProfile();
    } catch (error: any) {
      setNiches(previousNiches);
      toast.error(error?.response?.data?.message || "Failed to remove niche");
    } finally {
      setDeletingNiche(null);
    }
  };

  return (
    <div className="h-full">
      <CollapseCard
        title={t("Niches")}
        icon={<SquarePen size={15} className="text-dark-gray" />}
        className="h-full"
      >
        <div className="flex h-full min-h-[190px] flex-col">
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#9DB47B] border-t-transparent" />
              </div>
            ) : niches.length === 0 ? (
              <p className="mb-6 text-sm text-gray-500">No niches added yet</p>
            ) : (
              <div className="mb-6 flex flex-wrap gap-2">
                {niches.map((item, index) => {
                  const isUnverified = item.status === "unverified";

                  return (
                    <span
                      key={`${item.niche}-${index}`}
                      className="flex items-center gap-1 rounded-full bg-[#F1F6DE] px-3 py-1 text-sm text-[#2D5016]"
                    >
                      {item.niche}
                      {isUnverified ? (
                        <Clock3 className="h-3 w-3 text-[#E57A1F]" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3 text-[#078834]" />
                      )}
                      <button
                        onClick={() => handleRemoveNiche(item.niche)}
                        className="ml-1 rounded-full p-0.5 hover:bg-[#2D5016]/10 disabled:opacity-50"
                        disabled={deletingNiche === item.niche}
                        type="button"
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
            disabled={isLoading}
            type="button"
          >
            {t("+ Add another Niche")}
          </button>
        </div>
      </CollapseCard>

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
              onClick={handleSaveNiches}
              disabled={isSubmitting || isOptionsLoading}
              className="w-full bg-[#7A9A55] text-white hover:bg-[#6C894B]"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
