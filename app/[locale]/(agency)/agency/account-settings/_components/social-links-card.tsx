"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Music2,
  SquarePen,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AgencyProfileResponse, AgencySocialLinkItem } from "@/types/agency/account-settings";
import {
  getAgencyPlatformOptions,
  updateAgencySocialLinks,
} from "@/service/agency/account-settings";
import { notifyError, notifySuccess } from "@/utils/toast_util";

const SOCIAL_LINKS_PER_PAGE = 4;

type SocialLinksCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
  onProfileUpdated: (updatedProfile: AgencyProfileResponse) => void;
};

type PlatformOption = {
  id: string;
  name: string;
};

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

const SocialLinksCard = ({
  profile,
  isLoading,
  onProfileUpdated,
}: SocialLinksCardProps) => {
  const [socialLinks, setSocialLinks] = useState<AgencySocialLinkItem[]>([]);
  const [platformOptions, setPlatformOptions] = useState<PlatformOption[]>([]);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<AgencySocialLinkItem>({
    platform: "",
    url: "",
    status: "pending",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [isPlatformLoading, setIsPlatformLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setSocialLinks(profile?.socialLinks ?? []);
  }, [profile?.socialLinks]);

  const fetchPlatformOptions = async () => {
    try {
      setIsPlatformLoading(true);
      const options = await getAgencyPlatformOptions();
      setPlatformOptions(options);
    } catch (error: any) {
      notifyError(error?.response?.data?.message || "Failed to load platforms");
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
    setFormData({ platform: "", url: "", status: "pending" });
    setOpen(true);
    void fetchPlatformOptions();
  };

  const handleOpenEditDialog = (index: number) => {
    setEditingIndex(index);
    setFormData(socialLinks[index]);
    setOpen(true);
    void fetchPlatformOptions();
  };

  const buildMergedProfile = (
    baseProfile: AgencyProfileResponse,
    updatedLinks: AgencySocialLinkItem[],
    updatedProfile?: AgencyProfileResponse
  ): AgencyProfileResponse => ({
    ...baseProfile,
    ...(updatedProfile ?? {}),
    socialLinks: updatedLinks,
  });

  const handleSave = async () => {
    if (!profile) return;

    const normalizedFormData: AgencySocialLinkItem = {
      ...formData,
      platform: formData.platform.trim(),
      url: formData.url.trim(),
    };

    if (!normalizedFormData.platform) {
      notifyError("Platform is required");
      return;
    }

    if (!normalizedFormData.url) {
      notifyError("Social link URL is required");
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
      notifyError("This platform has already been added");
      return;
    }

    let updatedLinks: AgencySocialLinkItem[];
    const previousLinks = [...socialLinks];

    if (editingIndex !== null) {
      updatedLinks = [...socialLinks];
      updatedLinks[editingIndex] = normalizedFormData;
    } else {
      updatedLinks = [...socialLinks, { ...normalizedFormData, status: "pending" }];
    }

    try {
      setIsSubmitting(true);
      setSocialLinks(updatedLinks);
      if (editingIndex === null) {
        setCurrentPage(
          Math.max(0, Math.ceil(updatedLinks.length / SOCIAL_LINKS_PER_PAGE) - 1)
        );
      }
      setOpen(false);
      setFormData({ platform: "", url: "", status: "pending" });

      const updatedProfile = await updateAgencySocialLinks({
        socialLinks: updatedLinks.map((link) => ({
          platform: link.platform.trim(),
          url: link.url.trim(),
        })),
      });

      onProfileUpdated(buildMergedProfile(profile, updatedLinks, updatedProfile));
      notifySuccess(
        editingIndex !== null
          ? "Social link updated successfully"
          : "Social link added successfully"
      );
    } catch (error: any) {
      setSocialLinks(previousLinks);
      setOpen(true);
      notifyError(error?.response?.data?.message || "Failed to save social link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (index: number) => {
    if (!profile) return;

    const previousLinks = [...socialLinks];
    const updatedLinks = socialLinks.filter((_, itemIndex) => itemIndex !== index);

    try {
      setDeletingIndex(index);
      setSocialLinks(updatedLinks);

      const updatedProfile = await updateAgencySocialLinks({
        socialLinks: updatedLinks.map((link) => ({
          platform: link.platform.trim(),
          url: link.url.trim(),
        })),
      });

      onProfileUpdated(buildMergedProfile(profile, updatedLinks, updatedProfile));
      notifySuccess("Social link removed successfully");
    } catch (error: any) {
      setSocialLinks(previousLinks);
      notifyError(error?.response?.data?.message || "Failed to remove social link");
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <Card className="h-full">
      <div className="flex h-full min-h-[230px] flex-col px-4 py-4">
        <div className="mb-4 flex min-h-6 items-center justify-between gap-2 text-md font-semibold text-Primary">
          <p>Social Links</p>
        </div>

        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#9DB47B] border-t-transparent" />
            </div>
          ) : socialLinks.length === 0 ? (
            <p className="mb-6 text-sm text-gray-500">No social links found.</p>
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
                        onClick={() => void handleRemove(originalIndex)}
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
          disabled={isLoading || !profile}
          type="button"
        >
          + Add another Social Link
        </button>
      </div>

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
                    void handleSave();
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
                setFormData({ platform: "", url: "", status: "pending" });
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} disabled={isSubmitting || isPlatformLoading}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SocialLinksCard;
