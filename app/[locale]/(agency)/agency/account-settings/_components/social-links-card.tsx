"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FaClock,
  FaEdit,
  FaFacebookF,
  FaInstagram,
  FaLink,
  FaLinkedinIn,
  FaPinterestP,
} from "react-icons/fa";
import { SlSocialYoutube } from "react-icons/sl";
import { TbBrandTiktok, TbBrandX } from "react-icons/tb";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import type {
  AgencyProfileResponse,
  UpdateAgencySocialLinksPayload,
} from "@/types/agency/account-settings";
import { updateAgencySocialLinks } from "@/service/agency/account-settings";
import { notifyError, notifySuccess } from "@/utils/toast_util";

type SocialLinksCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
  onProfileUpdated: (updatedProfile: AgencyProfileResponse) => void;
};

type EditableSocialLink = {
  id: string;
  platform: string;
  url: string;
  status?: "approved" | "rejected" | "pending";
  isEditing?: boolean;
  isNew?: boolean;
  originalPlatform?: string;
  originalUrl?: string;
};

const createLocalId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const normalizeUrl = (url: string) =>
  url.trim().toLowerCase().replace(/\/+$/, "");

const getPlatformIcon = (platform: string) => {
  const normalized = platform.trim().toLowerCase();

  if (normalized === "instagram") return <FaInstagram size={28} />;
  if (normalized === "youtube") return <SlSocialYoutube size={28} />;
  if (normalized === "tiktok") return <TbBrandTiktok size={28} />;
  if (normalized === "facebook") return <FaFacebookF size={24} />;
  if (normalized === "linkedin") return <FaLinkedinIn size={24} />;
  if (normalized === "x" || normalized === "twitter") {
    return <TbBrandX size={24} />;
  }
  if (normalized === "pinterest") return <FaPinterestP size={24} />;

  return <FaLink size={24} />;
};

const SocialLinksCard = ({
  profile,
  isLoading,
  onProfileUpdated,
}: SocialLinksCardProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [socialLinks, setSocialLinks] = useState<EditableSocialLink[]>([]);

  useEffect(() => {
    setSocialLinks(
      (profile?.socialLinks ?? []).map((item, index) => ({
        id: `${item.platform}-${item.url}-${index}`,
        platform: item.platform,
        url: item.url,
        status: item.status,
        isEditing: false,
        isNew: false,
        originalPlatform: item.platform,
        originalUrl: item.url,
      }))
    );
  }, [profile]);

  const handleAddAnotherSocialLink = () => {
    setSocialLinks((prev) => [
      ...prev,
      {
        id: createLocalId(),
        platform: "",
        url: "",
        status: "pending",
        isEditing: true,
        isNew: true,
        originalPlatform: "",
        originalUrl: "",
      },
    ]);
  };

  const handleEditRow = (index: number) => {
    setSocialLinks((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index ? { ...item, isEditing: true } : item
      )
    );
  };

  const handleChangeRow = (
    index: number,
    key: "platform" | "url",
    value: string
  ) => {
    setSocialLinks((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [key]: value } : item
      )
    );
  };

  const buildMergedProfile = (
    baseProfile: AgencyProfileResponse,
    updatedProfile: AgencyProfileResponse,
    finalSocialLinks: EditableSocialLink[]
  ): AgencyProfileResponse => {
    return {
      ...baseProfile,
      ...updatedProfile,
      socialLinks: finalSocialLinks.map((item) => {
        const existingSocial = baseProfile.socialLinks?.find(
          (socialItem) =>
            socialItem.platform.toLowerCase() === item.platform.toLowerCase() &&
            normalizeUrl(socialItem.url) === normalizeUrl(item.url)
        );

        return {
          platform: item.platform.trim(),
          url: item.url.trim(),
          status: existingSocial?.status ?? "pending",
        };
      }),
    };
  };

  const syncLocalSocialLinks = (mergedProfile: AgencyProfileResponse) => {
    setSocialLinks(
      (mergedProfile.socialLinks ?? []).map((item, index) => ({
        id: `${item.platform}-${item.url}-${index}`,
        platform: item.platform,
        url: item.url,
        status: item.status,
        isEditing: false,
        isNew: false,
        originalPlatform: item.platform,
        originalUrl: item.url,
      }))
    );
  };

  const handleRemoveRow = async (index: number) => {
    if (!profile) return;

    const row = socialLinks[index];

    if (row.isNew) {
      setSocialLinks((prev) =>
        prev.filter((_, currentIndex) => currentIndex !== index)
      );
      return;
    }

    const nextSocialLinks = socialLinks.filter(
      (_, currentIndex) => currentIndex !== index
    );

    const payload: UpdateAgencySocialLinksPayload = {
      socialLinks: nextSocialLinks
        .filter((item) => item.platform.trim() && item.url.trim())
        .map((item) => ({
          platform: item.platform.trim(),
          url: item.url.trim(),
        })),
    };

    try {
      setIsSaving(true);

      const updatedProfile = await updateAgencySocialLinks(payload);

      const mergedProfile: AgencyProfileResponse = {
        ...profile,
        ...updatedProfile,
        socialLinks: nextSocialLinks
          .filter((item) => item.platform.trim() && item.url.trim())
          .map((item) => ({
            platform: item.platform.trim(),
            url: item.url.trim(),
            status: item.status ?? "pending",
          })),
      };

      setSocialLinks(nextSocialLinks);
      onProfileUpdated(mergedProfile);
      notifySuccess("Social link removed successfully");
    } catch (error) {
      console.error("Failed to remove social link:", error);
      notifyError("Failed to remove social link");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRow = async (index: number) => {
    if (!profile) return;

    const currentRow = socialLinks[index];

    if (!currentRow.platform.trim()) {
      notifyError("Platform is required");
      return;
    }

    if (!currentRow.url.trim()) {
      notifyError("Social link URL is required");
      return;
    }

    const currentNormalizedUrl = normalizeUrl(currentRow.url);

    const isDuplicate = socialLinks.some((item, i) => {
      if (i === index) return false;
      return normalizeUrl(item.url) === currentNormalizedUrl;
    });

    if (isDuplicate) {
      notifyError("This social link already exists");
      return;
    }

    const savedCurrentRow: EditableSocialLink = {
      ...currentRow,
      platform: currentRow.platform.trim(),
      url: currentRow.url.trim(),
      isEditing: false,
      isNew: false,
      originalPlatform: currentRow.platform.trim(),
      originalUrl: currentRow.url.trim(),
    };

    const persistedRows: EditableSocialLink[] = (profile.socialLinks ?? []).map(
      (item, rowIndex) => ({
        id: `${item.platform}-${item.url}-${rowIndex}`,
        platform: item.platform,
        url: item.url,
        status: item.status,
        isEditing: false,
        isNew: false,
        originalPlatform: item.platform,
        originalUrl: item.url,
      })
    );

    let finalSocialLinks: EditableSocialLink[];

    if (currentRow.isNew) {
      finalSocialLinks = [...persistedRows, savedCurrentRow];
    } else {
      finalSocialLinks = persistedRows.map((item) => {
        const isMatchedRow =
          item.originalPlatform === currentRow.originalPlatform &&
          item.originalUrl === currentRow.originalUrl;

        return isMatchedRow ? savedCurrentRow : item;
      });
    }

    const payload: UpdateAgencySocialLinksPayload = {
      socialLinks: finalSocialLinks.map((item) => ({
        platform: item.platform.trim(),
        url: item.url.trim(),
      })),
    };

    try {
      setIsSaving(true);

      const updatedProfile = await updateAgencySocialLinks(payload);

      const mergedProfile = buildMergedProfile(
        profile,
        updatedProfile,
        finalSocialLinks
      );

      syncLocalSocialLinks(mergedProfile);
      onProfileUpdated(mergedProfile);
      notifySuccess("Social link updated successfully");
    } catch (error) {
      console.error("Failed to update social links:", error);
      notifyError("Failed to update social links");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mb-4 p-0 text-md font-semibold text-Primary hover:cursor-pointer hover:no-underline">
              Social Links
            </AccordionTrigger>

            <AccordionContent className="space-y-6">
              <div className="space-y-2">
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : socialLinks.length ? (
                  socialLinks.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="pt-2">{getPlatformIcon(item.platform)}</div>

                      {item.isEditing ? (
                        <div className="flex-1 space-y-2">
                          <Input
                            value={item.platform}
                            onChange={(e) =>
                              handleChangeRow(index, "platform", e.target.value)
                            }
                            placeholder="Enter platform name"
                            disabled={isSaving}
                          />
                          <Input
                            value={item.url}
                            onChange={(e) =>
                              handleChangeRow(index, "url", e.target.value)
                            }
                            placeholder="Enter social link URL"
                            disabled={isSaving}
                          />
                        </div>
                      ) : (
                        <div className="min-w-0 flex-1 overflow-hidden break-words whitespace-normal rounded-2xl border px-4 py-2">
                          {item.url}
                        </div>
                      )}

                      <div className="flex shrink-0 items-center gap-3 self-center">
                        {!item.isEditing && item.status === "pending" ? (
                          <FaClock className="fill-orange" />
                        ) : null}

                        {item.isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => void handleSaveRow(index)}
                              disabled={isSaving}
                              className="cursor-pointer text-light-green"
                            >
                              <TiTick size={26} />
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleRemoveRow(index)}
                              disabled={isSaving}
                              className="cursor-pointer text-light-green"
                            >
                              <ImCross size={14} />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleEditRow(index)}
                            disabled={isSaving}
                            className="cursor-pointer text-gray-500"
                          >
                            <FaEdit />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No social links found.
                  </p>
                )}
              </div>

              <div>
                <Button
                  className="w-full cursor-pointer border border-dashed border-light-green bg-transparent text-light-green hover:bg-light-green hover:text-white"
                  size="sm"
                  type="button"
                  onClick={handleAddAnotherSocialLink}
                  disabled={isSaving}
                >
                  + Add another Social Link
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default SocialLinksCard;