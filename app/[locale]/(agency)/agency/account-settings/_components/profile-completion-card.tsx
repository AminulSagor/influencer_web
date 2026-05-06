"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidEdit } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import type {
  AgencyProfileResponse,
  UpdateAgencyBasicInfoPayload,
} from "@/types/agency/account-settings";
import { Textarea } from "@/components/ui/textarea";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import { updateAgencyBasicInfo } from "@/service/agency/account-settings";

type ProfileCompletionCardProps = {
  profile: AgencyProfileResponse | null;
  isLoading: boolean;
  onProfileUpdated: (updatedProfile: AgencyProfileResponse) => void;
};

const getCompletionPercentage = (profile: AgencyProfileResponse | null) => {
  if (!profile) return 0;

  const checks = [
    !!profile.agencyName,
    !!profile.firstName,
    !!profile.lastName,
    !!profile.logo,
    !!profile.agencyBio,
    !!profile.serviceFee,
    !!profile.dollarRate,
    !!profile.address?.thana,
    !!profile.address?.zilla,
    !!profile.address?.fullAddress,
    (profile.niches?.length ?? 0) > 0,
    (profile.socialLinks?.length ?? 0) > 0,
    !!profile.nidNumber,
    !!profile.tradeLicenseNumber,
    !!profile.tinNumber,
    !!profile.binNumber,
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

const ProfileCompletionCard = ({
  profile,
  isLoading,
  onProfileUpdated,
}: ProfileCompletionCardProps) => {
  const completion = getCompletionPercentage(profile);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bio, setBio] = useState("");

  useEffect(() => {
    setBio(profile?.agencyBio ?? "");
  }, [profile?.agencyBio]);

  const handleSaveBio = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);

      const payload: UpdateAgencyBasicInfoPayload = {
        agencyName: profile.agencyName ?? "",
        agencyBio: bio,
        logo: profile.logo ?? "",
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        secondaryPhone: profile.secondaryPhone ?? "",
        website: profile.website ?? "",
      };

      await updateAgencyBasicInfo(payload);

      // ✅ FIX: manually update profile instead of using API response
      const updatedProfile: AgencyProfileResponse = {
        ...profile,
        agencyBio: bio,
      };

      onProfileUpdated(updatedProfile);

      setIsEditingBio(false);
      notifySuccess("Bio updated successfully");
    } catch (error) {
      console.error("Failed to update bio:", error);
      notifyError("Failed to update bio");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-Primary">
          <FaCheckCircle /> Profile Completion
        </CardTitle>

        <div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-light-green/30">
            <div
              className="h-full rounded-full bg-light-green transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 rounded-lg border p-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-Primary">Bio</h2>

            {isEditingBio ? (
              <button
                type="button"
                className="cursor-pointer text-light-green"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void handleSaveBio();
                }}
                disabled={isSaving || isLoading}
              >
                <TiTick size={30} />
              </button>
            ) : (
              <button
                type="button"
                className="cursor-pointer text-Primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditingBio(true);
                }}
                disabled={isLoading}
              >
                <BiSolidEdit size={20} />
              </button>
            )}
          </div>

          {isEditingBio ? (
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isSaving}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          ) : (
            <p className="text-sm font-light text-gray-400">
              {isLoading ? "Loading..." : profile?.agencyBio || "-"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;