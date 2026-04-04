"use client";

import React, { useEffect, useMemo, useState } from "react";
import LaunchBannerCard from "@/app/[locale]/(brand)/brand/(pages)/unverified/_components/launch-banner-card";
import NeedHelpCard from "@/app/[locale]/(brand)/brand/(pages)/unverified/_components/need-help-card";
import ProfileCompletionCard from "@/app/[locale]/(brand)/brand/(pages)/unverified/_components/profile-completion-card";
import VerificationProgressCard from "@/app/[locale]/(brand)/brand/(pages)/unverified/_components/verification-progress-card";
import type { BrandProfile } from "@/types/client/profile/profile";
import { getProfile } from "@/service/client/profile/profile";

export default function UnverifiedPage() {
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);
      const response = await getProfile();

      if (!mounted) return;

      if (typeof response !== "string") {
        setProfile(response);
      } else {
        setProfile(null);
      }

      setLoading(false);
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const verificationCompletedCount = useMemo(() => {
    if (!profile) return 0;

    let count = 0;

    if (profile.nidVerification?.nidStatus === "approved") count += 1;
    if (profile.tradeLicenseVerification?.tradeLicenseStatus === "approved")
      count += 1;
    if (profile.tinVerification?.tinStatus === "approved") count += 1;
    if (profile.binVerification?.binStatus === "approved") count += 1;
    if (profile.isEmailVerified) count += 1;

    return count;
  }, [profile]);

  const verificationTotalCount = 5;

  const verificationPercent = Math.round(
    (verificationCompletedCount / verificationTotalCount) * 100,
  );

  const profileCompletedCount = useMemo(() => {
    if (!profile) return 0;

    let count = 0;

    if (profile.profileImg) count += 1;
    if (profile.niches?.length) count += 1;
    if (profile.website) count += 1;
    if (profile.fullAddress) count += 1;

    return count;
  }, [profile]);

  const profileTotalCount = 4;
  const profilePercent = Math.round(
    (profileCompletedCount / profileTotalCount) * 100,
  );

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <LaunchBannerCard role="agency" isVerified={profile?.isVerified ?? false} />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <VerificationProgressCard
          role="agency"
          profile={profile}
          progress={verificationPercent}
        />
        <ProfileCompletionCard profile={profile} progress={profilePercent} />
      </div>

      <NeedHelpCard />
    </div>
  );
}