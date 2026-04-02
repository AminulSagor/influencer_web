"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BiSolidUpArrowCircle } from "react-icons/bi";
import { FaPhoneAlt } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { MdEmail } from "react-icons/md";
import type {
  AgencyProfileResponse,
  UpdateAgencyAddressPayload,
  UpdateAgencyBasicInfoPayload,
} from "@/types/agency/account-settings";
import {
  updateAgencyAddress,
  updateAgencyBasicInfo,
  updateAgencyEmail,
} from "@/service/agency/account-settings";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import { uploadFile } from "@/service/common/upload/upload-file";

type ProfileCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
  onProfileUpdated: (updatedProfile: AgencyProfileResponse) => void;
};

type ProfileFormState = {
  agencyName: string;
  firstName: string;
  email: string;
  lastName: string;
  secondaryPhone: string;
  website: string;
  agencyBio: string;
  logo: string;
  thana: string;
  zilla: string;
  fullAddress: string;
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const ProfileCard = ({
  profile,
  isLoading,
  onProfileUpdated,
}: ProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [localLogoPreview, setLocalLogoPreview] = useState<string | null>(null);
  const [isLogoRemoved, setIsLogoRemoved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<ProfileFormState>({
    agencyName: "",
    firstName: "",
    email: "",
    lastName: "",
    secondaryPhone: "",
    website: "",
    agencyBio: "",
    logo: "",
    thana: "",
    zilla: "",
    fullAddress: "",
  });

  useEffect(() => {
    if (isEditing) return;

    setForm({
      agencyName: profile?.agencyName ?? "",
      firstName: profile?.firstName ?? "",
      email: profile?.email ?? "",
      lastName: profile?.lastName ?? "",
      secondaryPhone: profile?.secondaryPhone ?? "",
      website: profile?.website ?? "",
      agencyBio: profile?.agencyBio ?? "",
      logo: profile?.logo ?? "",
      thana: profile?.address?.thana ?? "",
      zilla: profile?.address?.zilla ?? "",
      fullAddress: profile?.address?.fullAddress ?? "",
    });

    setSelectedLogoFile(null);
    setLocalLogoPreview(null);
    setIsLogoRemoved(false);
  }, [profile, isEditing]);

  const ownerName =
    [form.firstName, form.lastName].filter(Boolean).join(" ") || "";

  const locationLine = [form.thana, form.zilla].filter(Boolean).join(", ");

  const hasLogo = !isLogoRemoved && !!(localLogoPreview || form.logo);
  const displayLogo = hasLogo ? localLogoPreview || form.logo || "" : "";

  const displayLogoSrc =
    !displayLogo || localLogoPreview
      ? displayLogo
      : `${displayLogo}${displayLogo.includes("?") ? "&" : "?"}v=${encodeURIComponent(profile?.updatedAt ?? "")}`;

  const handleChange = (key: keyof ProfileFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateRequiredFields = () => {
    if (!form.agencyName.trim()) {
      notifyError("Agency Name is required");
      return false;
    }

    if (!form.firstName.trim()) {
      notifyError("First Name is required");
      return false;
    }

    if (!form.lastName.trim()) {
      notifyError("Last Name is required");
      return false;
    }

    if (!form.email.trim()) {
      notifyError("Email Address is required");
      return false;
    }

    if (!form.thana.trim()) {
      notifyError("Thana is required");
      return false;
    }

    if (!form.zilla.trim()) {
      notifyError("Zilla is required");
      return false;
    }

    if (!form.fullAddress.trim()) {
      notifyError("Full Address is required");
      return false;
    }

    return true;
  };

  const handleEditOrSave = async () => {
    if (!profile) return;

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!validateRequiredFields()) return;

    try {
      setIsSaving(true);

      let finalLogo = form.logo;

      if (isLogoRemoved) {
        finalLogo = "";
      } else if (selectedLogoFile) {
        finalLogo = await uploadFile(selectedLogoFile);
      }

      const basicInfoPayload: UpdateAgencyBasicInfoPayload = {
        agencyName: form.agencyName.trim(),
        agencyBio: form.agencyBio.trim(),
        logo: finalLogo,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        secondaryPhone: form.secondaryPhone.trim(),
        website: form.website.trim(),
      };

      const addressPayload: UpdateAgencyAddressPayload = {
        address: {
          thana: form.thana.trim(),
          zilla: form.zilla.trim(),
          fullAddress: form.fullAddress.trim(),
        },
      };

      const emailChanged = form.email.trim() !== (profile.email ?? "");

      if (emailChanged) {
        await updateAgencyEmail({ newEmail: form.email.trim() });
      }

      await updateAgencyBasicInfo(basicInfoPayload);
      await updateAgencyAddress(addressPayload);

      const mergedProfile: AgencyProfileResponse = {
        ...profile,
        agencyName: form.agencyName.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        secondaryPhone: form.secondaryPhone.trim(),
        website: form.website.trim(),
        agencyBio: form.agencyBio.trim(),
        logo: finalLogo,
        email: emailChanged ? form.email.trim() : profile.email,
        address: {
          ...profile.address,
          thana: form.thana.trim(),
          zilla: form.zilla.trim(),
          fullAddress: form.fullAddress.trim(),
        },
      };

      setForm((prev) => ({
        ...prev,
        logo: finalLogo,
      }));
      setSelectedLogoFile(null);
      setLocalLogoPreview(null);
      setIsLogoRemoved(false);
      setIsEditing(false);
      onProfileUpdated(mergedProfile);
      notifySuccess("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      notifyError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveLogo = () => {
    if (!isEditing) return;

    setIsLogoRemoved(true);
    setSelectedLogoFile(null);
    setLocalLogoPreview(null);

    setForm((prev) => ({
      ...prev,
      logo: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadPhoto = () => {
    if (!isEditing || isSaving) return;
    fileInputRef.current?.click();
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_IMAGE_TYPES.includes(selected.type)) {
      notifyError("Only PNG or JPEG image is allowed");
      e.target.value = "";
      return;
    }

    if (selected.size > MAX_IMAGE_SIZE) {
      notifyError("Image size must be under 2MB");
      e.target.value = "";
      return;
    }

    setIsLogoRemoved(false);
    setSelectedLogoFile(selected);

    const reader = new FileReader();
    reader.onload = () => {
      setLocalLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(selected);
  };

  return (
    <Card>
      <div className="px-4">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="mb-4 p-0 text-md font-semibold text-Primary hover:cursor-pointer hover:no-underline">
              Profile
            </AccordionTrigger>

            <AccordionContent className="space-y-16">
              <div className="flex justify-between gap-6">
                <div className="flex flex-1 justify-around gap-6">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div
                      key={hasLogo ? displayLogoSrc : "no-logo"}
                      className="relative flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-full border border-dashed border-light-green bg-Secondary text-light-green"
                    >
                      {hasLogo ? (
                        <Image
                          src={displayLogoSrc}
                          alt={form.agencyName || "Agency logo"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <BiSolidUpArrowCircle size={30} />
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      onChange={handleLogoFileChange}
                      disabled={!isEditing || isSaving}
                    />

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={handleRemoveLogo}
                        disabled={!isEditing || isSaving}
                      >
                        Remove
                      </Button>
                      <Button
                        size="sm"
                        className="bg-light-green hover:bg-light-green/90"
                        type="button"
                        onClick={handleUploadPhoto}
                        disabled={!isEditing || isSaving}
                      >
                        Upload Photo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-Primary">
                        {isLoading ? "Loading..." : form.agencyName || "-"}
                      </h2>
                      <p className="text-sm text-light-green">
                        Owner: <b>{isLoading ? "Loading..." : ownerName || "-"}</b>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-light-green">
                        <HiLocationMarker size={30} />
                      </div>
                      <div>
                        <p className="font-semibold text-light-green">
                          {isLoading ? "Loading..." : form.zilla || "-"}
                        </p>
                        <p className="text-light-green">
                          {isLoading ? "Loading..." : locationLine || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-light-green">
                        <MdEmail size={22} />
                        <p>{isLoading ? "Loading..." : form.email || "-"}</p>
                      </div>

                      <div className="flex items-center gap-2 text-light-green">
                        <FaPhoneAlt size={20} />
                        <p>{isLoading ? "Loading..." : profile?.primaryPhone || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 text-end">
                  <Button
                    size="sm"
                    className="bg-light-green hover:bg-light-green/90"
                    type="button"
                    onClick={handleEditOrSave}
                    disabled={isSaving || isLoading || !profile}
                  >
                    {isSaving ? "Saving..." : isEditing ? "Save" : "Edit Profile"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6 space-y-4 px-1">
                  <div className="space-y-2">
                    <Label className="text-light-green">Agency Name *</Label>
                    <Input
                      placeholder="Enter Agency Name"
                      value={form.agencyName}
                      onChange={(e) => handleChange("agencyName", e.target.value)}
                      readOnly={!isEditing}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-light-green">First Name *</Label>
                    <Input
                      placeholder="Enter First Name"
                      value={form.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      readOnly={!isEditing}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-light-green">Last Name *</Label>
                    <Input
                      placeholder="Enter Last Name"
                      value={form.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      readOnly={!isEditing}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-light-green">Thana *</Label>
                    <Input
                      placeholder="Enter Thana"
                      value={form.thana}
                      onChange={(e) => handleChange("thana", e.target.value)}
                      readOnly={!isEditing}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-light-green">Zilla *</Label>
                    <Input
                      placeholder="Enter Zilla"
                      value={form.zilla}
                      onChange={(e) => handleChange("zilla", e.target.value)}
                      readOnly={!isEditing}
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="col-span-6 space-y-4">
                  <div className="space-y-2 px-1">
                    <Label className="text-light-green">Email Address *</Label>
                    <Input
                      placeholder="Enter Email Address"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      readOnly={!isEditing}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2 px-1">
                    <Label className="text-light-green">Phone Number *</Label>
                    <Input
                      placeholder=""
                      value={profile?.primaryPhone ?? ""}
                      readOnly
                      disabled
                    />
                  </div>

                  <div className="space-y-2 px-1">
                    <Label className="text-light-green">
                      Secondary Phone Number (Optional)
                    </Label>
                    <Input
                      placeholder="Enter Secondary Phone Number"
                      value={form.secondaryPhone}
                      onChange={(e) =>
                        handleChange("secondaryPhone", e.target.value)
                      }
                      readOnly={!isEditing}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2 px-1">
                    <Label className="text-light-green">Full Address *</Label>
                    <Textarea
                      placeholder="Enter Full Address"
                      value={form.fullAddress}
                      onChange={(e) => handleChange("fullAddress", e.target.value)}
                      readOnly={!isEditing}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default ProfileCard;