"use client";

import CollapseCard from "@/app/[locale]/(influencer)/influencer/_component/collapse-card";
import { SquarePen, X } from "lucide-react";
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
import { updateInfluencerSkills, deleteInfluencerSkill, getInfluencerProfile } from "@/service/influencer/profile/profile";
import { toast } from "sonner";
import { Skill } from "@/types/influencer/account_setting/profile_type";
import { skillsUpdateSchema } from "@/schemas/influencer/skills-validation";

export default function SkillsCard() {
  const t = useTranslations("influencer.account-setting");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [open, setOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSkill, setDeletingSkill] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profile = await getInfluencerProfile();
      if (profile.skills && profile.skills.length > 0) {
        setSkills(profile.skills);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      toast.error("Please enter a skill name");
      return;
    }

    if (skills.some((s) => s.skill === newSkill.trim())) {
      toast.error("This skill already exists");
      return;
    }

    const updatedSkills = [...skills, { skill: newSkill.trim(), status: "unverified" as const }];
    const skillStrings = updatedSkills.map(s => s.skill);

    const parsed = skillsUpdateSchema.safeParse({ skills: skillStrings });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid skills");
      return;
    }

    const previousSkills = [...skills];

    try {
      setIsSubmitting(true);
      setSkills(updatedSkills);
      setNewSkill("");
      setOpen(false);

      const response = await updateInfluencerSkills({ skills: skillStrings });

      toast.success(response.message || "Skill added successfully");
    } catch (error: any) {
      setSkills(previousSkills);
      setNewSkill(newSkill);
      setOpen(true);
      toast.error(error?.response?.data?.message || "Failed to add skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const previousSkills = [...skills];
    
    try {
      setDeletingSkill(skillToRemove);
      // Optimistically update UI
      setSkills(skills.filter((s) => s.skill !== skillToRemove));
      
      const response = await deleteInfluencerSkill(skillToRemove);
      
      toast.success(response.message || "Skill removed successfully");
    } catch (error: any) {
      // Revert on error
      setSkills(previousSkills);
      toast.error(error?.response?.data?.message || "Failed to remove skill");
    } finally {
      setDeletingSkill(null);
    }
  };

  return (
    <div>
      <CollapseCard
        title={t("Skills")}
        icon={<SquarePen size={15} className="text-dark-gray" />}
      >
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-[#9DB47B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : skills.length === 0 ? (
          <p className="text-sm text-gray-500 mb-6">No skills added yet</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-6">
          {skills.map((item) => (
            <span
              key={item.skill}
              className="px-3 py-1 rounded-full text-sm bg-[#F1F6DE] text-[#2D5016] flex items-center gap-1"
            >
              {item.skill}
              <button
                onClick={() => handleRemoveSkill(item.skill)}
                className="ml-1 hover:bg-[#2D5016]/10 rounded-full p-0.5 disabled:opacity-50"
                disabled={deletingSkill === item.skill}
              >
                {deletingSkill === item.skill ? (
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
          {t("+ Add another Skills")}
        </button>
      </CollapseCard>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Enter skill name (e.g., Video Editing, Photography)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSubmitting) {
                handleAddSkill();
              }
            }}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setNewSkill("");
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleAddSkill} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
