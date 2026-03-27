"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Upload, Loader2 } from "lucide-react";
import { updateInfluencerBasicInfo } from "@/service/influencer/profile/profile";
import { InfluencerProfileData } from "@/types/influencer/account_setting/profile_type";
import { useAuthStore } from "@/store/auth_store";
import Image from "next/image";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";
import { basicInfoUpdateSchema } from "@/schemas/influencer/basic-info-validation";

interface ProfileEditCardProps {
  profileData: InfluencerProfileData | null;
  loading: boolean;
  refreshProfile: () => void;
}

const ProfileEditCard = ({ profileData, loading, refreshProfile }: ProfileEditCardProps) => {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { email, phone } = useAuthStore();
  const { upload } = useFileUpload({
    module: "brandguru/influencer/profile",
    showToast: true,
  });

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    website: "",
  });

  // Sync form data with profileData when it changes
  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        website: profileData.website || "",
      });
      setImageError(false);
    }
  }, [profileData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await upload(file);
      if (result) {
        console.log("Uploaded image:", result.publicUrl);
        
        // Update profile image to server immediately
        const response = await updateInfluencerBasicInfo({
          firstName: profileData?.firstName || "",
          lastName: profileData?.lastName || "",
          bio: profileData?.bio || null,
          profileImg: result.publicUrl,
          website: profileData?.website || null,
        });

        if (response.success) {
          setImageError(false);
          toast.success("Profile image updated successfully");
          refreshProfile();
        } else {
          toast.error(response.message || "Failed to update profile image");
        }
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload profile image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!profileData?.profileImg) return;

    try {
      setUploading(true);
      const response = await updateInfluencerBasicInfo({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        bio: profileData.bio || null,
        profileImg: null,
        website: profileData.website || null,
      });

      if (response.success) {
        toast.success("Profile image removed successfully");
        refreshProfile();
      } else {
        toast.error(response.message || "Failed to remove profile image");
      }
    } catch (error) {
      console.error("Failed to remove image:", error);
      toast.error("Failed to remove profile image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const parsed = basicInfoUpdateSchema.safeParse({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      bio: profileData?.bio || null,
      profileImg: profileData?.profileImg || null,
      website: formData.website.trim() || null,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }

    try {
      setSaving(true);
      const response = await updateInfluencerBasicInfo(parsed.data);

      if (response.success) {
        setIsEditMode(false);
        toast.success(response.message || "Profile updated successfully");
        refreshProfile();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    setFormData({
      firstName: profileData?.firstName || "",
      lastName: profileData?.lastName || "",
      website: profileData?.website || "",
    });
    setIsEditMode(false);
  };

  const fullName = `${profileData?.firstName || ""} ${profileData?.lastName || ""}`.trim() || "User";
  const primaryAddress = profileData?.addresses?.[0];
  const location = primaryAddress
    ? `${primaryAddress.zilla}, Bangladesh`
    : "Location not set";
  const locationDetail = primaryAddress?.fullAddress || primaryAddress?.thana || "Not specified";

  if (loading) {
    return (
      <Card className="py-0 relative">
        <CardContent className="py-4 px-6 flex items-center justify-center min-h-50">
          <Loader2 className="w-6 h-6 animate-spin text-light-green" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-0 relative">
      <CardContent className="py-4 px-6">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            {/* Header */}
            <AccordionTrigger className="py-0 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-28">
                <h1 className="font-semibold text-base text-Primary">Profile</h1>
              </div>
            </AccordionTrigger>

            {/* Edit/Save/Cancel buttons */}
            <div className="absolute top-4 right-14 flex gap-2">
              {isEditMode ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-full text-xs px-6 border-light-green/40 text-Primary hover:bg-light-green/10 h-7"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-full text-xs px-6 bg-light-green text-white hover:bg-light-green/90 h-7"
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="rounded-full text-xs px-8 bg-light-green text-white hover:bg-light-green/90 h-7"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <AccordionContent className="pb-6 pt-4">
              <div className="space-y-7">
                {/* Top section */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                  <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
                    {/* Avatar upload */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-28 h-28 rounded-full border border-dashed border-light-green/60 bg-light-green/15 flex items-center justify-center overflow-hidden relative">
                        {uploading ? (
                          <Loader2 className="w-6 h-6 text-Primary/70 animate-spin" />
                        ) : profileData?.profileImg && !imageError ? (
                          <Image 
                            src={profileData.profileImg} 
                            alt="Profile"
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <Upload className="w-6 h-6 text-Primary/70" />
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleRemoveImage}
                          disabled={!profileData?.profileImg || uploading}
                          className="h-7 px-10 rounded-full text-xs border-light-green/40 text-Primary hover:bg-light-green/10 disabled:opacity-50"
                        >
                          Remove
                        </Button>
                        <Button
                          type="button"
                          onClick={() => document.getElementById('profile-image-upload')?.click()}
                          disabled={uploading}
                          className="h-7 px-10 rounded-full text-xs bg-light-green text-white hover:bg-light-green/90 disabled:opacity-50"
                        >
                          {uploading ? "Uploading..." : "Upload Photo"}
                        </Button>
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>

                    {/* Name + info */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-Primary">
                        {fullName}
                      </h3>
                      <p className="text-sm text-Primary/60">Influencer</p>

                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <span className="h-9 w-9 rounded-full bg-light-green/15 grid place-items-center">
                            <MapPin className="w-4 h-4 text-light-green" />
                          </span>
                          <div>
                            <p className="text-light-green font-medium">
                              {location}
                            </p>
                            <p className="text-Primary/50 text-xs">
                              {locationDetail}
                            </p>
                          </div>
                        </div>

                        {email && (
                          <div className="flex items-center gap-3">
                            <span className="h-9 w-9 rounded-full bg-light-green/15 grid place-items-center">
                              <Mail className="w-4 h-4 text-light-green" />
                            </span>
                            <p className="text-Primary/70 text-sm">
                              {email}
                            </p>
                          </div>
                        )}

                        {phone && (
                          <div className="flex items-center gap-3">
                            <span className="h-9 w-9 rounded-full bg-light-green/15 grid place-items-center">
                              <Phone className="w-4 h-4 text-light-green" />
                            </span>
                            <p className="text-Primary/70 text-sm">
                              {phone}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="mt-10 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="First Name *">
                      <Input
                        placeholder="Enter First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditMode}
                        className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </Field>

                    <Field label="Email Address *">
                      <Input
                        value={email || ""}
                        disabled
                        className="h-10 border-light-green/20 bg-light-green/10 text-Primary/60"
                      />
                    </Field>

                    <Field label="Last Name *">
                      <Input
                        placeholder="Enter Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditMode}
                        className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </Field>

                    <Field label="Phone Number *">
                      <Input
                        value={phone || ""}
                        disabled
                        className="h-10 border-light-green/20 bg-light-green/10 text-Primary/60"
                      />
                    </Field>

                    <Field label="Website (Optional)">
                      <Input
                        placeholder="https://yourwebsite.com"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        disabled={!isEditMode}
                        className="h-10 border-light-green/25 focus-visible:ring-1 focus-visible:ring-light-green/30 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ProfileEditCard;

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-light-green">{label}</p>
      {children}
    </div>
  );
}
