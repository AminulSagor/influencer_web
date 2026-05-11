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
import { serviceClient } from "@/service/base/axios_client";
import { getProfile } from "@/service/client/profile/profile";
import { updateProfileSocial } from "@/service/client/profile/update-profile-social";
import { BrandProfile } from "@/types/client/profile/profile";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import Loader from "@/components/spin-loader";
import { brandAssetsSchema } from "@/schemas/client/brand-assets.schema";

type PlatformOption = {
  id: string;
  name: string;
};

type SocialHandleRow = {
  id: string;
  platform: string;
  url: string;
};

const FALLBACK_PLATFORMS = ["Facebook", "Instagram", "Tiktok", "Youtube"];

const createRowId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `row-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const normalizePlatform = (platform: string) => platform.trim().toLowerCase();

const normalizePlatformOptions = (data: unknown): PlatformOption[] => {
  const items = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown })?.data)
      ? (data as { data: unknown[] }).data
      : [];

  const seen = new Set<string>();

  return items
    .map((item) => {
      const value = item as Partial<PlatformOption>;
      return {
        id: String(value.id ?? value.name ?? ""),
        name: String(value.name ?? "").trim(),
      };
    })
    .filter((item) => {
      const key = normalizePlatform(item.name);
      if (!item.name || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const getPlatformOptions = async (): Promise<PlatformOption[]> => {
  const response = await serviceClient.get<PlatformOption[]>(
    "/campaign/get/platforms",
  );

  return normalizePlatformOptions(response.data);
};

const BrandAssetsCard = () => {
  const t = useTranslations("brand.profile");
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [rows, setRows] = useState<SocialHandleRow[]>([]);
  const [website, setWebsite] = useState("");
  const [platformOptions, setPlatformOptions] = useState<PlatformOption[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const availablePlatformNames = useMemo(() => {
    const optionMap = new Map<string, string>();

    platformOptions.forEach((item) => {
      const name = item.name.trim();
      if (name) optionMap.set(normalizePlatform(name), name);
    });

    FALLBACK_PLATFORMS.forEach((name) => {
      if (!optionMap.has(normalizePlatform(name))) {
        optionMap.set(normalizePlatform(name), name);
      }
    });

    rows.forEach((row) => {
      const platform = row.platform.trim();
      if (platform && !optionMap.has(normalizePlatform(platform))) {
        optionMap.set(normalizePlatform(platform), platform);
      }
    });

    return Array.from(optionMap.values());
  }, [platformOptions, rows]);

  const getDefaultPlatform = () => availablePlatformNames[0] || "Instagram";

  const mapProfileToRows = (data: BrandProfile): SocialHandleRow[] => {
    const socialRows = (data.socialLinks || [])
      .map((item, index) => ({
        id: `${item.platform || "platform"}-${index}`,
        platform: String(item.platform || getDefaultPlatform()),
        url: item.url || "",
      }))
      .filter((item) => item.platform.trim().length > 0);

    if (socialRows.length > 0) return socialRows;

    return [
      {
        id: createRowId(),
        platform: getDefaultPlatform(),
        url: "",
      },
    ];
  };

  useEffect(() => {
    const handler = () => {
      setProfileRefreshKey((value) => value + 1);
    };

    window.addEventListener("app-data-refresh", handler);

    return () => {
      window.removeEventListener("app-data-refresh", handler);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsProfileLoading(true);

      const [profileResult, platformsResult] = await Promise.allSettled([
        getProfile(),
        getPlatformOptions(),
      ]);

      if (!isMounted) return;

      const nextPlatformOptions =
        platformsResult.status === "fulfilled" ? platformsResult.value : [];
      setPlatformOptions(nextPlatformOptions);

      if (profileResult.status !== "fulfilled") {
        notifyError("Failed to fetch profile");
        setProfile(null);
        setWebsite("");
        setRows([
          {
            id: createRowId(),
            platform: nextPlatformOptions[0]?.name || "Instagram",
            url: "",
          },
        ]);
        setIsProfileLoading(false);
        return;
      }

      const result = profileResult.value;

      if (typeof result === "string") {
        notifyError(result);
        setProfile(null);
        setWebsite("");
        setRows([
          {
            id: createRowId(),
            platform: nextPlatformOptions[0]?.name || "Instagram",
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

    loadData();

    return () => {
      isMounted = false;
    };
  }, [profileRefreshKey]);

  const usedPlatforms = useMemo(
    () => rows.map((row) => normalizePlatform(row.platform)),
    [rows],
  );

  const addRow = () => {
    const firstAvailable =
      availablePlatformNames.find(
        (platform) => !usedPlatforms.includes(normalizePlatform(platform)),
      ) || getDefaultPlatform();

    setRows((prev) => [
      ...prev,
      {
        id: createRowId(),
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
          id: createRowId(),
          platform: getDefaultPlatform(),
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
        platform: row.platform.trim(),
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
                                  platform: value,
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
                                {availablePlatformNames.map((platform) => (
                                  <SelectItem key={platform} value={platform}>
                                    {platform}
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
