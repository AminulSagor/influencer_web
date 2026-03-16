"use client";

import { useState, useEffect } from "react";
import LaunchBannerCard from "@/app/[locale]/(influencer)/influencer/(pages)/unverified/_components/launch-banner-card";
import NeedHelpCard from "@/app/[locale]/(influencer)/influencer/(pages)/unverified/_components/need-help-card";
import ProfileCompletionCard from "@/app/[locale]/(influencer)/influencer/(pages)/unverified/_components/profile-completion-card";
import VerificationProgressCard from "@/app/[locale]/(influencer)/influencer/(pages)/unverified/_components/verification-progress-card";
import { getInfluencerProfile } from "@/service/influencer/profile/profile";
import { InfluencerProfileData } from "@/types/influencer/account_setting/profile_type";

export default function UnverifiedPage() {
  const [profileData, setProfileData] = useState<InfluencerProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getInfluencerProfile();
        setProfileData(profileData);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-20">
          <p className="text-Primary/50">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LaunchBannerCard />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <VerificationProgressCard profileData={profileData} />
        <ProfileCompletionCard profileData={profileData} />
      </div>

      <NeedHelpCard />
    </div>
  );
}
