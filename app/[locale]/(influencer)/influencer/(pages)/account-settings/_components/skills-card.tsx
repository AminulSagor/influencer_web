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
  getInfluencerProfile,
  getInfluencerSkillOptions,
  updateInfluencerSkills,
} from "@/service/influencer/profile/profile";
import { toast } from "sonner";
import { Skill } from "@/types/influencer/account_setting/profile_type";
import { skillsUpdateSchema } from "@/schemas/influencer/skills-validation";

type SelectableItem = {
  id: string;
  name: string;
};

export default function SkillsCard() {
  const t = useTranslations("influencer.account-setting");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillOptions, setSkillOptions] = useState<SelectableItem[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSkill, setDeletingSkill] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profile = await getInfluencerProfile();
      setSkills(profile.skills ?? []);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSkillOptions = async () => {
    try {
      setIsOptionsLoading(true);
      const options = await getInfluencerSkillOptions();
      setSkillOptions(options);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load skills");
    } finally {
      setIsOptionsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setSelectedSkills(skills.map((item) => item.skill));
    setSearchQuery("");
    setOpen(true);
    fetchSkillOptions();
  };

  const mergedSkillOptions = useMemo(() => {
    const optionMap = new Map<string, SelectableItem>();

    skillOptions.forEach((item) => {
      optionMap.set(item.name.toLowerCase(), item);
    });

    skills.forEach((item) => {
      if (!optionMap.has(item.skill.toLowerCase())) {
        optionMap.set(item.skill.toLowerCase(), {
          id: item.skill,
          name: item.skill,
        });
      }
    });

    return Array.from(optionMap.values());
  }, [skillOptions, skills]);

  const filteredSkillOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return mergedSkillOptions;

    return mergedSkillOptions.filter((item) =>
      item.name.toLowerCase().includes(query),
    );
  }, [mergedSkillOptions, searchQuery]);

  const toggleSkill = (skillName: string) => {
    setSelectedSkills((current) =>
      current.includes(skillName)
        ? current.filter((item) => item !== skillName)
        : [...current, skillName],
    );
  };

  const handleSaveSkills = async () => {
    const parsed = skillsUpdateSchema.safeParse({ skills: selectedSkills });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid skills");
      return;
    }

    const previousSkills = [...skills];
    const nextSkills = selectedSkills.map((skill) => {
      const existingSkill = skills.find((item) => item.skill === skill);
      return existingSkill ?? { skill, status: "unverified" as const };
    });

    try {
      setIsSubmitting(true);
      setSkills(nextSkills);
      setOpen(false);

      const response = await updateInfluencerSkills({ skills: selectedSkills });
      toast.success(response.message || "Skills updated successfully");
      await fetchProfile();
    } catch (error: any) {
      setSkills(previousSkills);
      setOpen(true);
      toast.error(error?.response?.data?.message || "Failed to update skills");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const previousSkills = [...skills];
    const updatedSkills = skills.filter((item) => item.skill !== skillToRemove);
    const skillNames = updatedSkills.map((item) => item.skill);

    try {
      setDeletingSkill(skillToRemove);
      setSkills(updatedSkills);

      const response = await updateInfluencerSkills({ skills: skillNames });
      toast.success(response.message || "Skill removed successfully");
      await fetchProfile();
    } catch (error: any) {
      setSkills(previousSkills);
      toast.error(error?.response?.data?.message || "Failed to remove skill");
    } finally {
      setDeletingSkill(null);
    }
  };

  return (
    <div className="h-full">
      <CollapseCard
        title={t("Skills")}
        icon={<SquarePen size={15} className="text-dark-gray" />}
        className="h-full"
      >
        <div className="flex h-full min-h-[190px] flex-col">
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#9DB47B] border-t-transparent" />
              </div>
            ) : skills.length === 0 ? (
              <p className="mb-6 text-sm text-gray-500">No skills added yet</p>
            ) : (
              <div className="mb-6 flex flex-wrap gap-2">
                {skills.map((item, index) => {
                  const isUnverified = item.status === "unverified";

                  return (
                    <span
                      key={`${item.skill}-${index}`}
                      className="flex items-center gap-1 rounded-full bg-[#F1F6DE] px-3 py-1 text-sm text-[#2D5016]"
                    >
                      {item.skill}
                      {isUnverified ? (
                        <Clock3 className="h-3 w-3 text-[#E57A1F]" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3 text-[#078834]" />
                      )}
                      <button
                        onClick={() => handleRemoveSkill(item.skill)}
                        className="ml-1 rounded-full p-0.5 hover:bg-[#2D5016]/10 disabled:opacity-50"
                        disabled={deletingSkill === item.skill}
                        type="button"
                      >
                        {deletingSkill === item.skill ? (
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
            {t("+ Add another Skills")}
          </button>
        </div>
      </CollapseCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[430px] rounded-xl p-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#2D5016]">
              Skills
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search Skills"
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
              ) : filteredSkillOptions.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  No skills found
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredSkillOptions.map((item) => {
                    const isSelected = selectedSkills.includes(item.name);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleSkill(item.name)}
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
              onClick={handleSaveSkills}
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
