"use client";

import CollapseCard from "@/app/[locale]/(influencer)/influencer/_component/collapse-card";
import { SquarePen, Instagram, Youtube, Music2, Facebook, Twitter, Linkedin, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateInfluencerSocialLinks, deleteInfluencerSocialLink, getInfluencerProfile } from "@/service/influencer/profile/profile";
import { toast } from "sonner";
import { SocialLink } from "@/types/influencer/account_setting/profile_type";
import { socialLinksUpdateSchema, socialLinkSchema } from "@/schemas/influencer/social-links-validation";

const platformIcons: Record<string, any> = {
  Instagram: Instagram,
  YouTube: Youtube,
  TikTok: Music2,
  Facebook: Facebook,
  Twitter: Twitter,
  LinkedIn: Linkedin,
};

const platformOptions = [
  "Instagram",
  "YouTube",
  "TikTok",
  "Facebook",
  "Twitter",
  "LinkedIn",
];

export default function SocialLinksCard() {
  const t = useTranslations("influencer.account-setting");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<SocialLink>({
    platform: "",
    url: "",
    status: "unverified",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profile = await getInfluencerProfile();
      if (profile.socialLinks && profile.socialLinks.length > 0) {
        setSocialLinks(profile.socialLinks);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setEditingIndex(null);
    setFormData({ platform: "", url: "", status: "unverified" });
    setOpen(true);
  };

  const handleOpenEditDialog = (index: number) => {
    setEditingIndex(index);
    setFormData(socialLinks[index]);
    setOpen(true);
  };

  const handleSave = async () => {
    // Validate individual link with Zod
    const linkParsed = socialLinkSchema.safeParse({
      platform: formData.platform,
      url: formData.url.trim(),
    });
    if (!linkParsed.success) {
      toast.error(linkParsed.error.issues[0]?.message || "Invalid social link");
      return;
    }

    let updatedLinks: SocialLink[];
    const previousLinks = [...socialLinks];

    if (editingIndex !== null) {
      updatedLinks = [...socialLinks];
      updatedLinks[editingIndex] = formData;
    } else {
      if (socialLinks.some((link) => link.platform === formData.platform)) {
        toast.error("This platform has already been added");
        return;
      }
      updatedLinks = [...socialLinks, { ...formData, status: "unverified" }];
    }

    // Validate full array with Zod
    const arrayParsed = socialLinksUpdateSchema.safeParse({
      socialLinks: updatedLinks.map(link => ({
        platform: link.platform,
        url: link.url,
      })),
    });
    if (!arrayParsed.success) {
      toast.error(arrayParsed.error.issues[0]?.message || "Invalid social links");
      return;
    }

    try {
      setIsSubmitting(true);
      setSocialLinks(updatedLinks);
      setOpen(false);
      setFormData({ platform: "", url: "", status: "unverified" });

      const response = await updateInfluencerSocialLinks({
        socialLinks: updatedLinks.map(link => ({
          platform: link.platform,
          url: link.url
        }))
      });

      toast.success(
        response.message ||
          (editingIndex !== null
            ? "Social link updated successfully"
            : "Social link added successfully")
      );
    } catch (error: any) {
      setSocialLinks(previousLinks);
      setOpen(true);
      toast.error(
        error?.response?.data?.message || "Failed to save social link"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (index: number) => {
    const linkToRemove = socialLinks[index];
    const previousLinks = [...socialLinks];

    try {
      setDeletingIndex(index);
      // Optimistically update UI
      setSocialLinks(socialLinks.filter((_, i) => i !== index));
      
      const response = await deleteInfluencerSocialLink(linkToRemove.url);
      
      toast.success(response.message || "Social link removed successfully");
    } catch (error: any) {
      // Revert on error
      setSocialLinks(previousLinks);
      toast.error(
        error?.response?.data?.message || "Failed to remove social link"
      );
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div>
      <CollapseCard title={t("Social Links")}>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-[#9DB47B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : socialLinks.length === 0 ? (
          <p className="text-sm text-gray-500 mb-6">No social links added yet</p>
        ) : (
          <div className="space-y-3 mb-6">
          {socialLinks.map((item, index) => {
            const Icon = platformIcons[item.platform] || Instagram;

            return (
              <div key={index} className="flex items-center gap-3">
                {/* Platform icon */}
                <Icon className="w-5 h-5 text-[#2D5016]" />

                {/* Input */}
                <div className="flex items-center flex-1 border rounded-lg px-3 py-2">
                  <span className="flex-1 text-sm text-gray-600 truncate">
                    {item.url}
                  </span>

                  {/* Orange status dot */}
                  <span className="w-2 h-2 rounded-full bg-[#E57A1F] mx-3" />

                  {/* Edit icon */}
                  <button onClick={() => handleOpenEditDialog(index)}>
                    <SquarePen className="w-4 h-4 text-[#6B7A4C] cursor-pointer hover:text-[#2D5016]" />
                  </button>

                  {/* Remove icon */}
                  <button
                    onClick={() => handleRemove(index)}
                    className="ml-2 hover:bg-red-100 rounded-full p-1 disabled:opacity-50"
                    disabled={deletingIndex === index}
                  >
                    {deletingIndex === index ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Add button */}
        <button
          onClick={handleOpenAddDialog}
          className="w-full border border-dashed border-[#9DB47B] rounded-lg py-2 text-sm text-[#2D5016] hover:bg-[#F7FAEC] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {t("+ Add another social link")}
        </button>
      </CollapseCard>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Social Link" : "Add Social Link"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value })
                }
                disabled={editingIndex !== null}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL or Username</Label>
              <Input
                id="url"
                placeholder="https://instagram.com/username or just username"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSubmitting) {
                    handleSave();
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setFormData({ platform: "", url: "", status: "unverified" });
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
