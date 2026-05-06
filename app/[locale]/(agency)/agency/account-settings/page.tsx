"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BasicInfoCard from "./_components/basic-info-card";
import NicheCard from "./_components/niche-card";
import ProfileCompletionCard from "./_components/profile-completion-card";
import ServiceFeeCard from "./_components/service-fee-card";
import SocialLinksCard from "./_components/social-links-card";
import ProfileCard from "./_components/profile-card";
import PayoutSettingsCard from "./_components/payout-settings-card";
import VerificationMethodCard from "./_components/verification-method-card";
import DeleteAccountDangerZone from "@/components/account-settings/delete-account-danger-zone";
import { getAgencyProfile } from "@/service/agency/account-settings";
import type { AgencyProfileResponse } from "@/types/agency/account-settings";

const Page = () => {
  const [profile, setProfile] = useState<AgencyProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";

  useEffect(() => {
    const fetchAgencyProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getAgencyProfile();
        setProfile(response);
      } catch (error) {
        console.error("Failed to load agency profile:", error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencyProfile();
  }, []);

  const deleteAccountFullName =
    profile?.agencyName?.trim() ||
    `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();

  const handleProfileUpdated = (
    updatedProfile: Partial<AgencyProfileResponse>,
  ) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updatedProfile,
      };
    });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <BasicInfoCard profile={profile} isLoading={isLoading} />
        <div>
          <div className="h-full">
            <ProfileCompletionCard
              profile={profile}
              isLoading={isLoading}
              onProfileUpdated={handleProfileUpdated}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 items-stretch gap-4">
        <div className="col-span-12 md:col-span-4 h-full">
          <ServiceFeeCard isLoading={isLoading} />
        </div>
        <div className="col-span-12 md:col-span-4 h-full">
          <NicheCard
            profile={profile}
            isLoading={isLoading}
            onProfileUpdated={handleProfileUpdated}
          />
        </div>
        <div className="col-span-12 md:col-span-4 h-full">
          <SocialLinksCard
            profile={profile}
            isLoading={isLoading}
            onProfileUpdated={handleProfileUpdated}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 items-stretch gap-4">
        <div className="col-span-12 md:col-span-8">
          <ProfileCard
            profile={profile}
            isLoading={isLoading}
            onProfileUpdated={handleProfileUpdated}
          />
        </div>
        <div className="col-span-12 md:col-span-4 h-full">
          <PayoutSettingsCard
            profile={profile}
            isLoading={isLoading}
            onProfileUpdated={handleProfileUpdated}
          />
        </div>
      </div>

      <div>
        <VerificationMethodCard
          profile={profile}
          isLoading={isLoading}
          onProfileUpdated={handleProfileUpdated}
        />
      </div>

      <DeleteAccountDangerZone
        fullName={deleteAccountFullName}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Page;
