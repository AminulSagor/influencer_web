"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Edit, Plus, Search } from "lucide-react";
import toast from "react-hot-toast";

import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/client-profile-store";
import {
  addClientProfileNiches,
  getCampaignNiches,
  type CampaignNiche,
} from "@/service/client/profile/niche";

type ProfileNicheItem = {
  niche: string;
  status?: string;
};

const getProfileNicheName = (item: string | ProfileNicheItem) => {
  if (typeof item === "string") return item;
  return item.niche;
};

const NicheCard = () => {
  const profile = useProfileStore((s) => s.profile);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [niches, setNiches] = useState<CampaignNiche[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const profileNiches = useMemo(() => {
    const rawNiches = profile?.niches ?? [];

    return rawNiches.map((item) =>
      getProfileNicheName(item as string | ProfileNicheItem),
    );
  }, [profile?.niches]);

  const filteredNiches = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return niches;

    return niches.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [niches, search]);

  useEffect(() => {
    if (!isOpen) return;

    setSelectedNiches(profileNiches);
  }, [isOpen, profileNiches]);

  useEffect(() => {
    if (!isOpen || niches.length > 0) return;

    const fetchNiches = async () => {
      setIsFetching(true);

      try {
        const result = await getCampaignNiches();
        setNiches(result);
      } catch {
        toast.error("Failed to load niches");
      } finally {
        setIsFetching(false);
      }
    };

    fetchNiches();
  }, [isOpen, niches.length]);

  const handleToggleNiche = (niche: string) => {
    setSelectedNiches((prev) => {
      const isSelected = prev.includes(niche);

      if (isSelected) {
        return prev.filter((item) => item !== niche);
      }

      return [...prev, niche];
    });
  };

  const handleSave = async () => {
    const finalSelectedNiches = Array.from(new Set(selectedNiches));

    const hasChanges =
      finalSelectedNiches.length !== profileNiches.length ||
      finalSelectedNiches.some((item) => !profileNiches.includes(item));

    if (!hasChanges) {
      setIsOpen(false);
      return;
    }

    setIsSaving(true);

    try {
      await addClientProfileNiches(finalSelectedNiches);

      await fetchProfile();

      toast.success("Niches updated successfully");
      setIsOpen(false);
      setSearch("");
    } catch {
      toast.error("Failed to update niches");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Card className=" rounded-2xl border bg-white p-6 shadow-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-semibold text-[#2F5423]">Niches</h2>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-[#667085] transition hover:text-[#2F5423]"
              aria-label="Edit niches"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex h-34 flex-wrap gap-3 overflow-y-auto rounded-md p-2">
          {profileNiches.map((niche) => (
            <span
              key={niche}
              className="inline-flex h-fit items-center gap-2 rounded-full bg-[#F0F6DA] px-4 py-2 text-xs font-medium text-[#2F5423]"
            >
              {niche}
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2F5423] text-white">
                <Check className="h-2.5 w-2.5" />
              </span>
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full mt-6 items-center cursor-pointer justify-center gap-2 rounded-full border border-dashed border-[#7DA05D] py-2 text-sm font-medium text-[#2F5423] transition hover:bg-[#F0F6DA]"
        >
          <Plus className="h-4 w-4" />
          Add Another Niche
        </button>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[510px] rounded-2xl p-5">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#2F5423]">
              Niche
            </DialogTitle>
          </DialogHeader>

          <div className="relative mt-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#667085]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Niche"
              className="h-12 w-full rounded-2xl border border-[#A7A7A7] pl-12 pr-4 text-sm outline-none ring-2 ring-[#D6D6D6] transition focus:border-[#7DA05D]"
            />
          </div>

          <div className="mt-4 min-h-[120px] rounded-xl border border-[#E5E7EB] p-4">
            {isFetching ? (
              <p className="text-sm text-[#667085]">Loading niches...</p>
            ) : filteredNiches.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {filteredNiches.map((item) => {
                  const isSelected = selectedNiches.includes(item.name);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleNiche(item.name)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition",
                        isSelected
                          ? "bg-[#F0F6DA] text-[#2F5423]"
                          : "bg-[#F7F7F7] text-[#2F5423] hover:bg-[#F0F6DA]",
                      )}
                    >
                      {item.name}

                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[#667085]">No niche found</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="mt-4 h-10 w-full rounded-md bg-[#789B58] text-sm font-semibold text-white transition hover:bg-[#668846] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NicheCard;
