"use client";

import CollapseCard from "@/app/[locale]/(influencer)/influencer/_component/collapse-card";
import {
  SquarePen,
  Instagram,
  Youtube,
  Music2,
  Facebook,
  Twitter,
  Linkedin,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
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
import {
  deleteInfluencerSocialLink,
  getInfluencerPlatformOptions,
  getInfluencerProfile,
  updateInfluencerSocialLinks,
} from "@/service/influencer/profile/profile";
import { toast } from "sonner";
import { SocialLink } from "@/types/influencer/account_setting/profile_type";

const SOCIAL_LINKS_PER_PAGE = 4;

const getPlatformIcon = (platform?: string) => {
  const normalizedPlatform = platform?.trim().toLowerCase();

  if (normalizedPlatform === "youtube") return Youtube;
  if (normalizedPlatform === "tiktok") return Music2;
  if (normalizedPlatform === "facebook") return Facebook;
  if (normalizedPlatform === "twitter" || normalizedPlatform === "x") {
    return Twitter;
  }
  if (normalizedPlatform === "linkedin") return Linkedin;

  return Instagram;
};

export default function SocialLinksCard() {
  const t = useTranslations("influencer.account-setting");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [platformOptions, setPlatformOptions] = useState<
    { id: string; name: string }[]
  >([]);
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
  const [isPlatformLoading, setIsPlatformLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profile = await getInfluencerProfile();
      setSocialLinks(profile.socialLinks ?? []);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlatformOptions = async () => {
    try {
      setIsPlatformLoading(true);
      const options = await getInfluencerPlatformOptions();
      setPlatformOptions(options);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load platforms");
    } finally {
      setIsPlatformLoading(false);
    }
  };

  const mergedPlatformOptions = useMemo(() => {
    const optionMap = new Map<string, string>();

    platformOptions.forEach((item) => {
      const name = item.name.trim();
      if (name) optionMap.set(name.toLowerCase(), name);
    });

    socialLinks.forEach((item) => {
      const platform = item.platform.trim();
      if (platform && !optionMap.has(platform.toLowerCase())) {
        optionMap.set(platform.toLowerCase(), platform);
      }
    });

    const currentPlatform = formData.platform.trim();
    if (currentPlatform && !optionMap.has(currentPlatform.toLowerCase())) {
      optionMap.set(currentPlatform.toLowerCase(), currentPlatform);
    }

    return Array.from(optionMap.values());
  }, [formData.platform, platformOptions, socialLinks]);

  const totalPages = Math.ceil(socialLinks.length / SOCIAL_LINKS_PER_PAGE);

  const paginatedSocialLinks = useMemo(() => {
    const startIndex = currentPage * SOCIAL_LINKS_PER_PAGE;

    return socialLinks.slice(startIndex, startIndex + SOCIAL_LINKS_PER_PAGE);
  }, [currentPage, socialLinks]);

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 0) {
      setCurrentPage(0);
      return;
    }

    if (totalPages > 0 && currentPage > totalPages - 1) {
      setCurrentPage(totalPages - 1);
    }
  }, [currentPage, totalPages]);

  const handleOpenAddDialog = () => {
    setEditingIndex(null);
    setFormData({ platform: "", url: "", status: "unverified" });
    setOpen(true);
    fetchPlatformOptions();
  };

  const handleOpenEditDialog = (index: number) => {
    setEditingIndex(index);
    setFormData(socialLinks[index]);
    setOpen(true);
    fetchPlatformOptions();
  };

  const handleSave = async () => {
    const normalizedFormData: SocialLink = {
      ...formData,
      platform: formData.platform.trim(),
      url: formData.url.trim(),
    };

    if (!normalizedFormData.platform) {
      toast.error("Platform is required");
      return;
    }

    if (!normalizedFormData.url) {
      toast.error("Social link URL is required");
      return;
    }

    const isDuplicatePlatform = socialLinks.some((link, index) => {
      if (editingIndex === index) return false;
      return (
        link.platform.trim().toLowerCase() ===
        normalizedFormData.platform.toLowerCase()
      );
    });

    if (isDuplicatePlatform) {
      toast.error("This platform has already been added");
      return;
    }

    let updatedLinks: SocialLink[];
    const previousLinks = [...socialLinks];

    if (editingIndex !== null) {
      updatedLinks = [...socialLinks];
      updatedLinks[editingIndex] = normalizedFormData;
    } else {
      updatedLinks = [
        ...socialLinks,
        { ...normalizedFormData, status: "unverified" },
      ];
    }

    const hasInvalidLink = updatedLinks.some(
      (link) => !link.platform.trim() || !link.url.trim(),
    );

    if (hasInvalidLink) {
      toast.error("Every social link needs a platform and URL");
      return;
    }

    try {
      setIsSubmitting(true);
      setSocialLinks(updatedLinks);
      if (editingIndex === null) {
        setCurrentPage(
          Math.max(0, Math.ceil(updatedLinks.length / SOCIAL_LINKS_PER_PAGE) - 1),
        );
      }
      setOpen(false);
      setFormData({ platform: "", url: "", status: "unverified" });

      const response = await updateInfluencerSocialLinks({
        socialLinks: updatedLinks.map((link) => ({
          platform: link.platform.trim(),
          url: link.url.trim(),
        })),
      });

      toast.success(
        response.message ||
          (editingIndex !== null
            ? "Social link updated successfully"
            : "Social link added successfully"),
      );
      await fetchProfile();
    } catch (error: any) {
      setSocialLinks(previousLinks);
      setOpen(true);
      toast.error(error?.response?.data?.message || "Failed to save social link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (index: number) => {
    const linkToRemove = socialLinks[index];
    const previousLinks = [...socialLinks];

    try {
      setDeletingIndex(index);
      setSocialLinks(socialLinks.filter((_, i) => i !== index));
      const response = await deleteInfluencerSocialLink(linkToRemove.url);
      toast.success(response.message || "Social link removed successfully");
    } catch (error: any) {
      setSocialLinks(previousLinks);
      toast.error(error?.response?.data?.message || "Failed to remove social link");
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div className="h-full">
      <CollapseCard title={t("Social Links")} className="h-full">
        <div className="flex h-full min-h-[190px] flex-col">
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#9DB47B] border-t-transparent" />
              </div>
            ) : socialLinks.length === 0 ? (
              <p className="mb-6 text-sm text-gray-500">
                No social links added yet
              </p>
            ) : (
              <div className="mb-6 space-y-3">
                {paginatedSocialLinks.map((item, index) => {
                  const originalIndex = currentPage * SOCIAL_LINKS_PER_PAGE + index;
                  const Icon = getPlatformIcon(item.platform);

                  return (
                    <div
                      key={`${item.platform}-${item.url}-${originalIndex}`}
                      className="flex items-center gap-3"
                    >
                      <Icon className="h-5 w-5 text-[#2D5016]" />

                      <div className="flex flex-1 items-center rounded-lg border px-3 py-2">
                        <span className="flex-1 truncate text-sm text-gray-600">
                          {item.url}
                        </span>

                        <span className="mx-3 h-2 w-2 rounded-full bg-[#E57A1F]" />

                        <button
                          onClick={() => handleOpenEditDialog(originalIndex)}
                          type="button"
                        >
                          <SquarePen className="h-4 w-4 cursor-pointer text-[#6B7A4C] hover:text-[#2D5016]" />
                        </button>

                        <button
                          onClick={() => handleRemove(originalIndex)}
                          className="ml-2 rounded-full p-1 hover:bg-red-100 disabled:opacity-50"
                          disabled={deletingIndex === originalIndex}
                          type="button"
                        >
                          {deletingIndex === originalIndex ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Go to social links page ${index + 1}`}
                        onClick={() => setCurrentPage(index)}
                        className={`h-2.5 w-2.5 rounded-full transition-all ${
                          currentPage === index
                            ? "w-5 bg-[#2D5016]"
                            : "bg-[#D8E2C8] hover:bg-[#9DB47B]"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleOpenAddDialog}
            className="mt-auto w-full rounded-lg border border-dashed border-[#9DB47B] py-2 text-sm text-[#2D5016] hover:bg-[#F7FAEC] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            type="button"
          >
            {t("+ Add another social link")}
          </button>
        </div>
      </CollapseCard>

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
                disabled={isSubmitting || isPlatformLoading}
              >
                <SelectTrigger id="platform">
                  <SelectValue
                    placeholder={
                      isPlatformLoading ? "Loading platforms..." : "Select platform"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {isPlatformLoading && mergedPlatformOptions.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Loading platforms...
                    </div>
                  ) : mergedPlatformOptions.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No platforms found
                    </div>
                  ) : (
                    mergedPlatformOptions.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))
                  )}
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
            <Button onClick={handleSave} disabled={isSubmitting || isPlatformLoading}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
