"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/spin-loader";
import { ExternalLink } from "lucide-react";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import { useProfileStore } from "@/store/client-profile-store";
import { BrandProfile } from "@/types/client/profile/profile";
import { updateClientBin } from "@/service/client/profile/update-bin";
import { updateClientNid } from "@/service/client/profile/update-nid";
import { updateClientTin } from "@/service/client/profile/update-tin";
import { updateClientTradeLicense } from "@/service/client/profile/update-trade-license";
import { clientNidUpdateSchema } from "@/schemas/client/client-nid-update.schema";
import { clientTinUpdateSchema } from "@/schemas/client/client-tin-update.schema";
import { clientBinUpdateSchema } from "@/schemas/client/client-bin-update.schema";
import { clientTradeLicenseUpdateSchema } from "@/schemas/client/client-trade-license-update.schema";
import VerificationBanner from "./verification-banner";
import VerificationField from "./verification-field";
import VerificationUploadBox from "./verification-upload-box";
import {
  EMPTY_UPLOAD_STATE,
  ACCEPT,
  DEFAULT_FORM,
} from "../_lib/verification-methods.constants";
import {
  createPreviewUrl,
  getFileNameFromUrl,
  mapProfileToForm,
  mapProfileToUploads,
  mapZodIssuesToErrors,
  normalizeText,
  validateFile,
  isUploadChanged,
  getPreviewUrlFromExistingUrl,
} from "../_lib/verification-methods.helpers";
import { uploadVerificationFile } from "../_lib/upload-verification-file";
import {
  FieldErrors,
  UploadErrors,
  UploadFieldKey,
  UploadItemState,
  VerificationFormState,
} from "@/types/client/profile/verification-methods.type";
import Link from "next/link";

export default function VerificationMethodsCard() {
  const t = useTranslations("brand.profile");
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  const [form, setForm] = useState<VerificationFormState>(DEFAULT_FORM);
  const [initialForm, setInitialForm] =
    useState<VerificationFormState>(DEFAULT_FORM);

  const [uploads, setUploads] = useState<
    Record<UploadFieldKey, UploadItemState>
  >({
    nidFront: EMPTY_UPLOAD_STATE,
    nidBack: EMPTY_UPLOAD_STATE,
    tradeLicense: EMPTY_UPLOAD_STATE,
    tinCertificate: EMPTY_UPLOAD_STATE,
  });

  const [initialUploads, setInitialUploads] = useState<
    Record<UploadFieldKey, UploadItemState>
  >({
    nidFront: EMPTY_UPLOAD_STATE,
    nidBack: EMPTY_UPLOAD_STATE,
    tradeLicense: EMPTY_UPLOAD_STATE,
    tinCertificate: EMPTY_UPLOAD_STATE,
  });

  const [formErrors, setFormErrors] = useState<FieldErrors>({});
  const [uploadErrors, setUploadErrors] = useState<UploadErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const locale = useLocale();

  const hydrateFromProfile = (data: BrandProfile) => {
    const nextForm = mapProfileToForm(data);
    const nextUploads = mapProfileToUploads(data);

    setForm(nextForm);
    setInitialForm(nextForm);
    setUploads(nextUploads);
    setInitialUploads(nextUploads);
    setFormErrors({});
    setUploadErrors({});
  };

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsLoading(true);

      if (!profile) {
        await fetchProfile();
      }

      if (!isMounted) return;

      const latestProfile = useProfileStore.getState().profile;
      if (latestProfile) {
        hydrateFromProfile(latestProfile);
      }

      setIsLoading(false);
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [profile, fetchProfile]);

  const handleChange = (field: keyof VerificationFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const updateUploadState = (key: UploadFieldKey, next: UploadItemState) => {
    setUploads((prev) => {
      const prevItem = prev[key];
      if (prevItem.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prevItem.previewUrl);
      }

      return {
        ...prev,
        [key]: next,
      };
    });
  };

  const handleSelectFile = (key: UploadFieldKey, file: File | null) => {
    setUploadErrors((prev) => ({
      ...prev,
      [key]: "",
    }));

    if (!file) {
      const existingUrl = initialUploads[key].existingUrl;
      updateUploadState(key, {
        file: null,
        existingUrl,
        previewUrl: getPreviewUrlFromExistingUrl(existingUrl),
      });
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setUploadErrors((prev) => ({
        ...prev,
        [key]: validationError,
      }));
      return;
    }

    updateUploadState(key, {
      file,
      existingUrl: "",
      previewUrl: createPreviewUrl(file),
    });
  };

  const handleRemoveFile = (key: UploadFieldKey) => {
    if (!isEditing || isSaving) return;

    updateUploadState(key, {
      file: null,
      existingUrl: "",
      previewUrl: "",
    });

    setUploadErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      hydrateFromProfile(profile);
    }
    setIsEditing(false);
  };

  const hasNidChanged = useMemo(
    () =>
      normalizeText(form.nidNumber) !== normalizeText(initialForm.nidNumber) ||
      isUploadChanged(uploads.nidFront, initialUploads.nidFront) ||
      isUploadChanged(uploads.nidBack, initialUploads.nidBack),
    [form.nidNumber, initialForm.nidNumber, uploads, initialUploads],
  );

  const hasTradeLicenseChanged = useMemo(
    () =>
      normalizeText(form.tradeLicenseNumber) !==
        normalizeText(initialForm.tradeLicenseNumber) ||
      isUploadChanged(uploads.tradeLicense, initialUploads.tradeLicense),
    [
      form.tradeLicenseNumber,
      initialForm.tradeLicenseNumber,
      uploads.tradeLicense,
      initialUploads.tradeLicense,
    ],
  );

  const hasTinChanged = useMemo(
    () =>
      normalizeText(form.tinNumber) !== normalizeText(initialForm.tinNumber) ||
      isUploadChanged(uploads.tinCertificate, initialUploads.tinCertificate),
    [
      form.tinNumber,
      initialForm.tinNumber,
      uploads.tinCertificate,
      initialUploads.tinCertificate,
    ],
  );

  const hasBinChanged = useMemo(
    () =>
      normalizeText(form.binNumber) !== normalizeText(initialForm.binNumber),
    [form.binNumber, initialForm.binNumber],
  );

  const hasAnyChange =
    hasNidChanged || hasTradeLicenseChanged || hasTinChanged || hasBinChanged;

  const handleSave = async () => {
    if (!profile) return;

    setFormErrors({});
    setUploadErrors({});
    setIsSaving(true);

    try {
      let nextProfile: BrandProfile = { ...profile };

      if (hasNidChanged) {
        let nidFrontImg = uploads.nidFront.existingUrl;
        let nidBackImg = uploads.nidBack.existingUrl;

        if (uploads.nidFront.file) {
          const uploadedUrl = await uploadVerificationFile(
            uploads.nidFront.file,
            "brandguru/client/profile",
          );
          if (!uploadedUrl) {
            notifyError(t("messages_v.uploadFailed"));
            return;
          }
          nidFrontImg = uploadedUrl;
        }

        if (uploads.nidBack.file) {
          const uploadedUrl = await uploadVerificationFile(
            uploads.nidBack.file,
            "brandguru/client/profile",
          );
          if (!uploadedUrl) {
            notifyError(t("messages_v.uploadFailed"));
            return;
          }
          nidBackImg = uploadedUrl;
        }

        const nidPayload = {
          nidNumber: normalizeText(form.nidNumber),
          nidFrontImg,
          nidBackImg,
        };

        const validation = clientNidUpdateSchema.safeParse(nidPayload);

        if (!validation.success) {
          const mapped = mapZodIssuesToErrors(validation.error.issues, {
            nidFrontImg: "nidFront",
            nidBackImg: "nidBack",
          });
          setFormErrors((prev) => ({ ...prev, ...mapped.formErrors }));
          setUploadErrors((prev) => ({ ...prev, ...mapped.uploadErrors }));
          return;
        }

        const result = await updateClientNid(validation.data);

        if (result !== "success") {
          notifyError(t("messages_v.nidUpdateFailed"));
          return;
        }

        nextProfile = {
          ...nextProfile,
          nidNumber: nidPayload.nidNumber,
          nidFrontImg: nidPayload.nidFrontImg,
          nidBackImg: nidPayload.nidBackImg,
        };
      }

      if (hasTradeLicenseChanged) {
        let tradeLicenseImg = uploads.tradeLicense.existingUrl;

        if (uploads.tradeLicense.file) {
          const uploadedUrl = await uploadVerificationFile(
            uploads.tradeLicense.file,
            "brandguru/client/docs",
          );
          if (!uploadedUrl) {
            notifyError(t("messages_v.uploadFailed"));
            return;
          }
          tradeLicenseImg = uploadedUrl;
        }

        const tradeLicensePayload = {
          tradeLicenseNumber: normalizeText(form.tradeLicenseNumber),
          tradeLicenseImg,
        };

        const validation =
          clientTradeLicenseUpdateSchema.safeParse(tradeLicensePayload);

        if (!validation.success) {
          const mapped = mapZodIssuesToErrors(validation.error.issues, {
            tradeLicenseImg: "tradeLicense",
          });
          setFormErrors((prev) => ({ ...prev, ...mapped.formErrors }));
          setUploadErrors((prev) => ({ ...prev, ...mapped.uploadErrors }));
          return;
        }

        const result = await updateClientTradeLicense(validation.data);

        if (result !== "success") {
          notifyError(t("messages_v.tradeLicenseUpdateFailed"));
          return;
        }

        nextProfile = {
          ...nextProfile,
          tradeLicenseNumber: tradeLicensePayload.tradeLicenseNumber,
          tradeLicenseImg: tradeLicensePayload.tradeLicenseImg,
        };
      }

      if (hasTinChanged) {
        let tinImage = uploads.tinCertificate.existingUrl;

        if (uploads.tinCertificate.file) {
          const uploadedUrl = await uploadVerificationFile(
            uploads.tinCertificate.file,
            "brandguru/client/docs",
          );
          if (!uploadedUrl) {
            notifyError(t("messages_v.uploadFailed"));
            return;
          }
          tinImage = uploadedUrl;
        }

        const tinPayload = {
          tinNumber: normalizeText(form.tinNumber),
          tinImage,
        };

        const validation = clientTinUpdateSchema.safeParse(tinPayload);

        if (!validation.success) {
          const mapped = mapZodIssuesToErrors(validation.error.issues, {
            tinImage: "tinCertificate",
          });
          setFormErrors((prev) => ({ ...prev, ...mapped.formErrors }));
          setUploadErrors((prev) => ({ ...prev, ...mapped.uploadErrors }));
          return;
        }

        const result = await updateClientTin(validation.data);

        if (result !== "success") {
          notifyError(t("messages_v.tinUpdateFailed"));
          return;
        }

        nextProfile = {
          ...nextProfile,
          tinNumber: tinPayload.tinNumber,
          tinImage: tinPayload.tinImage,
        };
      }

      if (hasBinChanged) {
        const binPayload = {
          binNumber: normalizeText(form.binNumber),
        };

        const validation = clientBinUpdateSchema.safeParse(binPayload);

        if (!validation.success) {
          const mapped = mapZodIssuesToErrors(validation.error.issues);
          setFormErrors((prev) => ({ ...prev, ...mapped.formErrors }));
          setUploadErrors((prev) => ({ ...prev, ...mapped.uploadErrors }));
          return;
        }

        const result = await updateClientBin(validation.data);

        if (result !== "success") {
          notifyError(t("messages_v.binUpdateFailed"));
          return;
        }

        nextProfile = {
          ...nextProfile,
          binNumber: binPayload.binNumber,
        };
      }

      setProfile(nextProfile);
      hydrateFromProfile(nextProfile);
      setIsEditing(false);
      notifySuccess(t("messages_v.updateSuccess"));
      fetchProfile();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="relative py-0">
      <CardContent className="px-6 py-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="py-0 hover:no-underline">
              <div className="flex w-full items-center justify-between pr-16">
                <h1 className="text-base font-semibold text-orange">
                  {t("verification.title")}
                </h1>
              </div>
            </AccordionTrigger>

            <button
              type="button"
              className="absolute top-4.5 left-[210px] hidden text-dark-gray hover:text-orange md:inline-flex"
              aria-label={t("verification.open")}
              title={t("verification.open")}
            >
              <Link
                href={`/${locale}/brand/account-settings/varification-checklist`}
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </button>

            <div className="absolute top-4 right-6 flex items-center gap-3">
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading || isSaving}
                  className="h-7 rounded-full border-orange px-6 text-xs text-orange hover:bg-orange/5"
                >
                  {t("actions.cancel")}
                </Button>
              )}

              <Button
                type="button"
                onClick={isEditing ? handleSave : handleEdit}
                disabled={isLoading || (isEditing && !hasAnyChange) || isSaving}
                className="h-7 rounded-full bg-orange px-8 text-xs text-white hover:bg-orange/90"
              >
                {isSaving ? (
                  <Loader className="h-4 w-4 border-white border-t-transparent" />
                ) : isEditing ? (
                  t("verification.actions.saveDocuments")
                ) : (
                  t("verification.actions.editDocuments")
                )}
              </Button>
            </div>

            <AccordionContent className="pt-4 pb-6">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader className="h-8 w-8" />
                </div>
              ) : (
                <div className="space-y-6">
                  <VerificationBanner
                    isVerified={profile?.isVerified ?? false}
                  />

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-4">
                      <VerificationField
                        label={t("verification.fields.nidNumber")}
                        error={formErrors.nidNumber}
                      >
                        <Input
                          value={form.nidNumber}
                          onChange={(e) =>
                            handleChange("nidNumber", e.target.value)
                          }
                          disabled={!isEditing || isSaving}
                          placeholder={t("verification.placeholders.nidNumber")}
                          className="h-10 border-black/10 focus-visible:ring-1 focus-visible:ring-orange/30"
                        />
                      </VerificationField>

                      <VerificationUploadBox
                        title={t("verification.fields.nidFront")}
                        hint={t("verification.uploadHint")}
                        inputId="file-nidFront"
                        accept={ACCEPT}
                        isEditing={isEditing}
                        isSaving={isSaving}
                        file={uploads.nidFront.file}
                        previewUrl={uploads.nidFront.previewUrl}
                        existingUrl={uploads.nidFront.existingUrl}
                        error={uploadErrors.nidFront}
                        onPick={(file) => handleSelectFile("nidFront", file)}
                        onRemove={() => handleRemoveFile("nidFront")}
                        uploadedName={
                          uploads.nidFront.file?.name ||
                          getFileNameFromUrl(uploads.nidFront.existingUrl)
                        }
                      />

                      <VerificationUploadBox
                        title={t("verification.fields.nidBack")}
                        hint={t("verification.uploadHint")}
                        inputId="file-nidBack"
                        accept={ACCEPT}
                        isEditing={isEditing}
                        isSaving={isSaving}
                        file={uploads.nidBack.file}
                        previewUrl={uploads.nidBack.previewUrl}
                        existingUrl={uploads.nidBack.existingUrl}
                        error={uploadErrors.nidBack}
                        onPick={(file) => handleSelectFile("nidBack", file)}
                        onRemove={() => handleRemoveFile("nidBack")}
                        uploadedName={
                          uploads.nidBack.file?.name ||
                          getFileNameFromUrl(uploads.nidBack.existingUrl)
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      <VerificationField
                        label={t("verification.fields.tradeLicenseNumber")}
                        error={formErrors.tradeLicenseNumber}
                      >
                        <Input
                          value={form.tradeLicenseNumber}
                          onChange={(e) =>
                            handleChange("tradeLicenseNumber", e.target.value)
                          }
                          disabled={!isEditing || isSaving}
                          placeholder={t(
                            "verification.placeholders.tradeLicenseNumber",
                          )}
                          className="h-10 border-black/10 focus-visible:ring-1 focus-visible:ring-orange/30"
                        />
                      </VerificationField>

                      <VerificationUploadBox
                        title={t("verification.fields.tradeLicense")}
                        hint={t("verification.uploadHint")}
                        inputId="file-tradeLicense"
                        accept={ACCEPT}
                        isEditing={isEditing}
                        isSaving={isSaving}
                        file={uploads.tradeLicense.file}
                        previewUrl={uploads.tradeLicense.previewUrl}
                        existingUrl={uploads.tradeLicense.existingUrl}
                        error={uploadErrors.tradeLicense}
                        onPick={(file) =>
                          handleSelectFile("tradeLicense", file)
                        }
                        onRemove={() => handleRemoveFile("tradeLicense")}
                        uploadedName={
                          uploads.tradeLicense.file?.name ||
                          getFileNameFromUrl(uploads.tradeLicense.existingUrl)
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      <VerificationField
                        label={t("verification.fields.tinNumber")}
                        error={formErrors.tinNumber}
                      >
                        <Input
                          value={form.tinNumber}
                          onChange={(e) =>
                            handleChange("tinNumber", e.target.value)
                          }
                          disabled={!isEditing || isSaving}
                          placeholder={t("verification.placeholders.tinNumber")}
                          className="h-10 border-black/10 focus-visible:ring-1 focus-visible:ring-orange/30"
                        />
                      </VerificationField>

                      <VerificationUploadBox
                        title={t("verification.fields.tinCertificate")}
                        hint={t("verification.uploadHint")}
                        inputId="file-tinCertificate"
                        accept={ACCEPT}
                        isEditing={isEditing}
                        isSaving={isSaving}
                        file={uploads.tinCertificate.file}
                        previewUrl={uploads.tinCertificate.previewUrl}
                        existingUrl={uploads.tinCertificate.existingUrl}
                        error={uploadErrors.tinCertificate}
                        onPick={(file) =>
                          handleSelectFile("tinCertificate", file)
                        }
                        onRemove={() => handleRemoveFile("tinCertificate")}
                        uploadedName={
                          uploads.tinCertificate.file?.name ||
                          getFileNameFromUrl(uploads.tinCertificate.existingUrl)
                        }
                      />

                      <VerificationField
                        label={t("verification.fields.binNumber")}
                        error={formErrors.binNumber}
                      >
                        <Input
                          value={form.binNumber}
                          onChange={(e) =>
                            handleChange("binNumber", e.target.value)
                          }
                          disabled={!isEditing || isSaving}
                          placeholder={t("verification.placeholders.binNumber")}
                          className="h-10 border-black/10 focus-visible:ring-1 focus-visible:ring-orange/30"
                        />
                      </VerificationField>
                    </div>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
