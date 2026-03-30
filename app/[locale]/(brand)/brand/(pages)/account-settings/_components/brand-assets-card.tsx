"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProfile } from "@/service/client/profile/profile";
import { updateProfileSocial } from "@/service/client/profile/update-profile-social";
import { BrandProfile } from "@/types/client/profile/profile";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import Loader from "@/components/spin-loader";
import { brandAssetsSchema } from "@/schemas/client/brand-assets.schema";

type SocialPlatform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin";

type SocialHandleRow = {
  id: string;
  platform: SocialPlatform;
  url: string;
};

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

const AVAILABLE_PLATFORMS = Object.keys(PLATFORM_LABELS) as SocialPlatform[];

const BrandAssetsCard = () => {
  const t = useTranslations("brand.profile");
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [rows, setRows] = useState<SocialHandleRow[]>([]);
  const [website, setWebsite] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const mapProfileToRows = (data: BrandProfile): SocialHandleRow[] => {
    const socialRows = (data.socialLinks || [])
      .filter((item) =>
        AVAILABLE_PLATFORMS.includes(item.platform as SocialPlatform),
      )
      .map((item, index) => ({
        id: `${item.platform}-${index}`,
        platform: item.platform as SocialPlatform,
        url: item.url || "",
      }));

    if (socialRows.length > 0) return socialRows;

    return [
      {
        id: crypto.randomUUID(),
        platform: "instagram",
        url: "",
      },
    ];
  };

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsProfileLoading(true);
      const result = await getProfile();

      if (!isMounted) return;

      if (typeof result === "string") {
        notifyError(result);
        setProfile(null);
        setWebsite("");
        setRows([
          {
            id: crypto.randomUUID(),
            platform: "instagram",
            url: "",
          },
        ]);
        setIsProfileLoading(false);
        return;
      }

      setProfile(result);
      setWebsite(result.website || "");
      setRows(mapProfileToRows(result));
      setIsProfileLoading(false);
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const usedPlatforms = useMemo(() => rows.map((row) => row.platform), [rows]);

  const addRow = () => {
    const firstAvailable =
      AVAILABLE_PLATFORMS.find(
        (platform) => !usedPlatforms.includes(platform),
      ) || "instagram";

    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        platform: firstAvailable,
        url: "",
      },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      const updatedRows = prev.filter((row) => row.id !== id);

      if (updatedRows.length > 0) return updatedRows;

      return [
        {
          id: crypto.randomUUID(),
          platform: "instagram",
          url: "",
        },
      ];
    });
  };

  const updateRow = (id: string, patch: Partial<SocialHandleRow>) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  };

  const handleEditToggle = () => {
    if (isEditing && profile) {
      setWebsite(profile.website || "");
      setRows(mapProfileToRows(profile));
    }

    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    const filteredRows = rows
      .map((row) => ({
        platform: row.platform,
        url: row.url.trim(),
      }))
      .filter((row) => row.url.trim() !== "");

    const validation = brandAssetsSchema.safeParse({
      website: website.trim(),
      socialLinks: filteredRows,
    });

    if (!validation.success) {
      const firstError =
        validation.error.issues[0]?.message || "Invalid form data";
      notifyError(firstError);
      return;
    }

    setIsSaving(true);

    const updateResult = await updateProfileSocial(validation.data);

    if (updateResult !== "success") {
      notifyError(updateResult);
      setIsSaving(false);
      return;
    }

    const refreshedProfile = await getProfile();

    if (typeof refreshedProfile === "string") {
      notifyError(refreshedProfile);
      setIsSaving(false);
      return;
    }

    setProfile(refreshedProfile);
    setWebsite(refreshedProfile.website || "");
    setRows(mapProfileToRows(refreshedProfile));
    setIsEditing(false);
    setIsSaving(false);

    notifySuccess(t("brandAssets.updateSuccess"));
  };

  return (
    <Card className="relative py-0">
      <CardContent className="px-5 py-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="py-0 hover:no-underline">
              <div className="flex w-full items-center justify-between pr-28">
                <h1 className="text-base font-semibold text-Primary">
                  {t("brandAssets.title")}
                </h1>
              </div>
            </AccordionTrigger>

            <button
              type="button"
              onClick={handleEditToggle}
              disabled={isProfileLoading || isSaving}
              className="absolute top-4.5 right-16 cursor-pointer rounded-full border bg-light-green px-8 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEditing ? t("common.cancel") : t("common.edit")}
            </button>

            <AccordionContent className="pt-4 pb-1">
              {isProfileLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-8 w-8" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs text-Primary/70">
                      {t("brandAssets.website")}
                    </p>
                    <Input
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder={t("brandAssets.websitePlaceholder")}
                      disabled={!isEditing || isSaving}
                      className="h-10 border-light-green/40 focus-visible:ring-1 focus-visible:ring-light-green/40"
                    />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-sm font-medium text-Primary">
                      {t("brandAssets.socialHandles")}
                    </h2>

                    <div className="space-y-3">
                      {rows.map((row) => (
                        <div
                          key={row.id}
                          className="grid grid-cols-[150px_1fr] items-end gap-3"
                        >
                          <div className="space-y-1">
                            <p className="text-xs text-Primary/70">
                              {t("brandAssets.chooseHandle")}
                            </p>
                            <Select
                              value={row.platform}
                              onValueChange={(value) =>
                                updateRow(row.id, {
                                  platform: value as SocialPlatform,
                                })
                              }
                              disabled={!isEditing || isSaving}
                            >
                              <SelectTrigger className="h-10 border-light-green/40 text-xs focus:ring-1 focus:ring-light-green/40">
                                <SelectValue
                                  placeholder={t("brandAssets.select")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {AVAILABLE_PLATFORMS.map((platform) => (
                                  <SelectItem key={platform} value={platform}>
                                    {PLATFORM_LABELS[platform]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs text-Primary/70">
                              {t("brandAssets.profileLink")}
                            </p>

                            <div className="relative">
                              <Input
                                value={row.url}
                                onChange={(e) =>
                                  updateRow(row.id, { url: e.target.value })
                                }
                                placeholder={t("brandAssets.linkPlaceholder")}
                                disabled={!isEditing || isSaving}
                                className="h-10 border-light-green/40 pr-10 placeholder:text-xs focus-visible:ring-1 focus-visible:ring-light-green/40"
                              />

                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => removeRow(row.id)}
                                  className="absolute top-1/2 right-2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md hover:bg-light-green/10"
                                  aria-label="Remove"
                                  title="Remove"
                                >
                                  <X className="h-4 w-4 text-Primary/60" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {isEditing && (
                      <button
                        type="button"
                        onClick={addRow}
                        disabled={isSaving}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-light-green/50 py-3 text-sm text-Primary transition hover:bg-light-green/5 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Plus className="h-4 w-4 text-light-green" />
                        <span className="text-Primary">
                          {t("brandAssets.addAnother")}
                        </span>
                      </button>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex min-w-24 items-center justify-center rounded-md bg-light-green px-6 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving ? (
                          <Loader className="h-5 w-5 border-white border-t-transparent" />
                        ) : (
                          t("common.save")
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default BrandAssetsCard;