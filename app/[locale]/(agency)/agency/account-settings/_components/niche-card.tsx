"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BiSolidEdit } from "react-icons/bi";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";
import { updateAgencyNiches } from "@/service/agency/account-settings";
import { notifyError, notifySuccess } from "@/utils/toast_util";

type NicheCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
  onProfileUpdated: (updatedProfile: AgencyProfileResponse) => void;
};

const NicheCard = ({
  profile,
  isLoading,
  onProfileUpdated,
}: NicheCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newNiche, setNewNiche] = useState("");
  const [niches, setNiches] = useState<string[]>([]);

  useEffect(() => {
    if (!isEditing) {
      setNiches(profile?.niches?.map((item) => item.niche) ?? []);
    }
  }, [profile, isEditing]);

  const normalizeNiche = (value: string) => value.trim();

  const isDuplicateNiche = (value: string, currentNiches: string[]) => {
    return currentNiches.some(
      (item) => item.toLowerCase() === value.toLowerCase()
    );
  };

  const handleAddNiche = () => {
    const trimmed = normalizeNiche(newNiche);

    if (!trimmed) {
      notifyError("Niche name is required");
      return;
    }

    if (isDuplicateNiche(trimmed, niches)) {
      notifyError("This niche already exists");
      return;
    }

    setNiches((prev) => [...prev, trimmed]);
    setNewNiche("");
  };

  const handleRemoveNiche = (nicheToRemove: string) => {
    setNiches((prev) => prev.filter((item) => item !== nicheToRemove));
  };

  const handleRemoveNicheWithEditState = (nicheToRemove: string) => {
    if (!isEditing) {
      setIsEditing(true);
    }

    handleRemoveNiche(nicheToRemove);
  };

  const getFinalNichesForSave = () => {
    const trimmed = normalizeNiche(newNiche);

    if (!trimmed) return niches;

    if (isDuplicateNiche(trimmed, niches)) {
      return niches;
    }

    return [...niches, trimmed];
  };

  const handleEditOrSave = async () => {
    if (!profile) return;

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const finalNiches = getFinalNichesForSave();

    if (finalNiches.length === 0) {
      notifyError("At least one niche is required");
      return;
    }

    try {
      setIsSaving(true);

      const updatedProfile = await updateAgencyNiches({
        niches: finalNiches,
      });

      const mergedProfile: AgencyProfileResponse = {
        ...profile,
        ...updatedProfile,
        niches: finalNiches.map((item) => {
          const existingNiche = profile.niches?.find(
            (nicheItem) => nicheItem.niche.toLowerCase() === item.toLowerCase()
          );

          return {
            niche: item,
            status: existingNiche?.status ?? "pending",
            rejectReason: existingNiche?.rejectReason,
          };
        }),
      };

      setNiches(finalNiches);
      setNewNiche("");
      onProfileUpdated(mergedProfile);
      setIsEditing(false);

      notifySuccess("Niches updated successfully");
    } catch (error) {
      console.error("Failed to update niches:", error);
      notifyError("Failed to update niches");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mb-4 p-0 text-md font-semibold text-Primary hover:no-underline">
              <div className="flex w-full items-center justify-between pr-2">
                <p className="flex items-center gap-2">Niche</p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void handleEditOrSave();
                  }}
                  disabled={isLoading || isSaving || !profile}
                  className="cursor-pointer text-Primary"
                >
                  {isSaving ? (
                    <span className="text-sm">Saving...</span>
                  ) : isEditing ? (
                    <TiTick size={30} className="text-light-green" />
                  ) : (
                    <BiSolidEdit size={20} />
                  )}
                </button>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {isLoading ? (
                    <Badge className="bg-Secondary px-4 py-1 text-Primary">
                      Loading...
                    </Badge>
                  ) : niches.length ? (
                    niches.map((item, index) => (
                      <Badge
                        key={`${item}-${index}`}
                        className="flex items-center gap-2 bg-Secondary px-4 py-1 text-Primary"
                      >
                        <FaCheckCircle />
                        {item}

                        <button
                          type="button"
                          onClick={() => handleRemoveNicheWithEditState(item)}
                          className="ml-1 cursor-pointer"
                          disabled={isSaving}
                        >
                          <FaTimes size={12} />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No niches found.
                    </p>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="Enter niche name"
                      value={newNiche}
                      onChange={(e) => setNewNiche(e.target.value)}
                      disabled={isSaving}
                    />

                    <Button
                      className="w-full cursor-pointer border border-dashed border-light-green bg-transparent text-light-green hover:bg-light-green hover:text-white"
                      size="sm"
                      type="button"
                      onClick={handleAddNiche}
                      disabled={isSaving}
                    >
                      + Add another Niche
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full border border-dashed border-light-green bg-transparent text-light-green hover:bg-light-green hover:text-white"
                    size="sm"
                    type="button"
                    disabled
                  >
                    + Add another Niche
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default NicheCard;