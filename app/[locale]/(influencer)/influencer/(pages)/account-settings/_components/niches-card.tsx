"use client";

import CollapseCard from "@/app/[locale]/(influencer)/influencer/_component/collapse-card";
import { Check, SquarePen, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateInfluencerNiches, getInfluencerProfile } from "@/service/influencer/profile/profile";
import { toast } from "sonner";
import { Niche } from "@/types/influencer/account_setting/profile_type";
import { nichesUpdateSchema } from "@/schemas/influencer/niches-validation";

export default function NichesCard() {
  const t = useTranslations("influencer.account-setting");
  const [niches, setNiches] = useState<Niche[]>([]);
  const [open, setOpen] = useState(false);
  const [newNiche, setNewNiche] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingNiche, setDeletingNiche] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profile = await getInfluencerProfile();
      if (profile.niches && profile.niches.length > 0) {
        setNiches(profile.niches);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNiche = async () => {
    if (!newNiche.trim()) {
      toast.error("Please enter a niche name");
      return;
    }

    if (niches.some((n) => n.niche === newNiche.trim())) {
      toast.error("This niche already exists");
      return;
    }

    const updatedNiches = [...niches, { niche: newNiche.trim(), status: "unverified" as const }];
    const nicheStrings = updatedNiches.map(n => n.niche);

    const parsed = nichesUpdateSchema.safeParse({ niches: nicheStrings });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid niches");
      return;
    }

    const previousNiches = [...niches];

    try {
      setIsSubmitting(true);
      setNiches(updatedNiches);
      setNewNiche("");
      setOpen(false);

      const response = await updateInfluencerNiches({ niches: nicheStrings });

      toast.success(response.message || "Niche added successfully");
    } catch (error: any) {
      setNiches(previousNiches);
      setNewNiche(newNiche);
      setOpen(true);
      toast.error(error?.response?.data?.message || "Failed to add niche");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveNiche = async (nicheToRemove: string) => {
    const updatedNiches = niches.filter((n) => n.niche !== nicheToRemove);
    const previousNiches = [...niches];

    try {
      setDeletingNiche(nicheToRemove);
      // Optimistically update UI
      setNiches(updatedNiches);
      
      // Transform to array of strings for API
      const response = await updateInfluencerNiches({ 
        niches: updatedNiches.map(n => n.niche) 
      });
      
      toast.success(response.message || "Niche removed successfully");
    } catch (error: any) {
      // Revert on error
      setNiches(previousNiches);
      toast.error(error?.response?.data?.message || "Failed to remove niche");
    } finally {
      setDeletingNiche(null);
    }
  };

  return (
    <div>
      <CollapseCard
        title={t("Niches")}
        icon={<SquarePen size={15} className="text-dark-gray" />}
      >
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-[#9DB47B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : niches.length === 0 ? (
          <p className="text-sm text-gray-500 mb-6">No niches added yet</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-6">
          {niches.map((item) => (
            <span
              key={item.niche}
              className="px-3 py-1 rounded-full text-sm bg-[#F1F6DE] text-[#2D5016] flex items-center gap-1"
            >
              {item.niche}
              <Check className="w-3 h-3" />
              <button
                onClick={() => handleRemoveNiche(item.niche)}
                className="ml-1 hover:bg-[#2D5016]/10 rounded-full p-0.5 disabled:opacity-50"
                disabled={deletingNiche === item.niche}
              >
                {deletingNiche === item.niche ? (
                  <div className="w-3 h-3 border border-[#2D5016] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <X className="w-3 h-3" />
                )}
              </button>
            </span>
          ))}
        </div>
        )}

        {/* Action */}
        <button
          onClick={() => setOpen(true)}
          className="w-full border border-dashed border-[#9DB47B] rounded-lg py-2 text-sm text-[#2D5016] hover:bg-[#F7FAEC] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {t("+ Add another Niche")}
        </button>
      </CollapseCard>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Niche</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Enter niche name (e.g., Fashion, Travel)"
            value={newNiche}
            onChange={(e) => setNewNiche(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSubmitting) {
                handleAddNiche();
              }
            }}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setNewNiche("");
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNiche} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
