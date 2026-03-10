"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "@/components/spin-loader";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import { BrandProfile } from "@/types/client/profile/profile";
import ProfilePhotoSection from "./profile-photo-section";
import ProfileBasicInfoSection from "./profile-basic-info-section";
import ProfileFormSection from "./profile-form-section";
import { profileUpdateSchema } from "@/schemas/client/profile-update.schema";
import { updateClientProfile } from "@/service/client/profile/update-profile";
import { updateClientProfileAddress } from "@/service/client/profile/update-profile-address";
import { getSignedUrl } from "@/service/client/upload/get-signed-url";
import { uploadFileToS3 } from "@/service/client/upload/upload-file-to-s3";
import { useProfileStore } from "@/store/client-profile-store";

export type ProfileFormState = {
  brandName: string;
  firstName: string;
  lastName: string;
  profileImg: string;
  thana: string;
  zilla: string;
  fullAddress: string;
  website: string;
};

const defaultForm: ProfileFormState = {
  brandName: "",
  firstName: "",
  lastName: "",
  profileImg: "",
  thana: "",
  zilla: "",
  fullAddress: "",
  website: "",
};

const ProfileUpdateCard = () => {
  const t = useTranslations("brand.profile");

  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  const [form, setForm] = useState<ProfileFormState>(defaultForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileFormState, string>>
  >({});

  const setFormFromProfile = (data: BrandProfile) => {
    setForm({
      brandName: data.brandName || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      profileImg: data.profileImg || "",
      thana: data.thana || "",
      zilla: data.zilla || "",
      fullAddress: data.fullAddress || "",
      website: data.website || "",
    });
    setPreviewImage(data.profileImg || "");
    setSelectedFile(null);
    setErrors({});
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

      if (!latestProfile) {
        setIsLoading(false);
        return;
      }

      setFormFromProfile(latestProfile);
      setIsLoading(false);
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [profile, fetchProfile]);

  const handleChange = (field: keyof ProfileFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormFromProfile(profile);
    } else {
      setForm(defaultForm);
      setPreviewImage("");
      setSelectedFile(null);
      setErrors({});
    }

    setIsEditing(false);
  };

  const handleImageSelect = (file: File | null) => {
    setSelectedFile(file);

    if (!file) {
      setPreviewImage(profile?.profileImg || "");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreviewImage(localUrl);
  };

  const handleRemoveImage = () => {
    if (!isEditing || isSaving) return;

    setSelectedFile(null);
    setPreviewImage("");
    setForm((prev) => ({
      ...prev,
      profileImg: "",
    }));
  };

  const handleSave = async () => {
    const validation = profileUpdateSchema.safeParse({
      ...form,
      profileImg: form.profileImg || previewImage || "",
    });

    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof ProfileFormState, string>> = {};

      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (
          typeof fieldName === "string" &&
          !fieldErrors[fieldName as keyof ProfileFormState]
        ) {
          fieldErrors[fieldName as keyof ProfileFormState] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);

    let finalProfileImg = form.profileImg || "";

    if (selectedFile) {
      const signedUrlResult = await getSignedUrl({
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        module: "brandguru/client/docs",
      });

      if (typeof signedUrlResult === "string") {
        notifyError(t("messages.signedUrlFailed"));
        setIsSaving(false);
        return;
      }

      const uploadResult = await uploadFileToS3(
        signedUrlResult.signedUrl,
        selectedFile,
      );

      if (uploadResult !== true) {
        notifyError(t("messages.uploadFailed"));
        setIsSaving(false);
        return;
      }

      finalProfileImg = signedUrlResult.publicUrl;
    } else if (!previewImage) {
      finalProfileImg = "";
    }

    const profileResult = await updateClientProfile({
      brandName: form.brandName.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      profileImg: finalProfileImg,
      website: form.website.trim(),
    });

    if (profileResult !== "success") {
      notifyError(t("messages.profileUpdateFailed"));
      setIsSaving(false);
      return;
    }

    const addressResult = await updateClientProfileAddress({
      thana: form.thana.trim(),
      zilla: form.zilla.trim(),
      fullAddress: form.fullAddress.trim(),
    });

    if (addressResult !== "success") {
      notifyError(t("messages.addressUpdateFailed"));
      setIsSaving(false);
      return;
    }

    const updatedProfile: BrandProfile | null = profile
      ? {
          ...profile,
          brandName: form.brandName.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          profileImg: finalProfileImg,
          thana: form.thana.trim(),
          zilla: form.zilla.trim(),
          fullAddress: form.fullAddress.trim(),
          website: form.website.trim(),
        }
      : null;

    if (updatedProfile) {
      setProfile(updatedProfile);
      setFormFromProfile(updatedProfile);
    } else {
      setForm((prev) => ({
        ...prev,
        profileImg: finalProfileImg,
        website: form.website.trim(),
      }));
      setPreviewImage(finalProfileImg);
      setSelectedFile(null);
    }

    setIsEditing(false);
    setIsSaving(false);
    notifySuccess(t("messages.updateSuccess"));

    fetchProfile();
  };

  return (
    <Card className="relative bg-white py-0">
      <CardContent className="py-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="py-0 hover:no-underline">
              <div className="flex w-full items-center justify-between pr-28">
                <h1 className="text-base font-semibold text-Primary">
                  {t("title")}
                </h1>
              </div>
            </AccordionTrigger>

            <div className="absolute top-4 right-14 flex items-center gap-3">
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isLoading || isSaving}
                  className="h-7 rounded-full border-light-green px-6 text-xs text-light-green hover:bg-light-green/5 disabled:opacity-60"
                >
                  {t("actions.cancel")}
                </Button>
              )}

              <Button
                type="button"
                onClick={isEditing ? handleSave : handleEditToggle}
                disabled={isLoading || isSaving}
                className="h-7 rounded-full bg-light-green px-8 text-xs text-white hover:bg-light-green/90 disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader className="h-4 w-4 border-white border-t-transparent" />
                ) : isEditing ? (
                  t("actions.saveProfile")
                ) : (
                  t("actions.editProfile")
                )}
              </Button>
            </div>

            <AccordionContent className="pt-4 pb-6">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader className="h-8 w-8" />
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="flex gap-8">
                    <ProfilePhotoSection
                      imageUrl={previewImage}
                      brandName={form.brandName}
                      isEditing={isEditing}
                      isSaving={isSaving}
                      onFileSelect={handleImageSelect}
                      onRemove={handleRemoveImage}
                    />

                    <ProfileBasicInfoSection
                      brandName={form.brandName}
                      firstName={form.firstName}
                      lastName={form.lastName}
                      country={profile?.country || ""}
                      thana={form.thana}
                      zilla={form.zilla}
                      fullAddress={form.fullAddress}
                      email={profile?.email || ""}
                      phone={profile?.phone || ""}
                    />
                  </div>

                  <ProfileFormSection
                    form={form}
                    isEditing={isEditing}
                    isSaving={isSaving}
                    email={profile?.email || ""}
                    phone={profile?.phone || ""}
                    nidNumber={profile?.nidNumber || ""}
                    binNumber={profile?.binNumber || ""}
                    errors={errors}
                    onChange={handleChange}
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ProfileUpdateCard;