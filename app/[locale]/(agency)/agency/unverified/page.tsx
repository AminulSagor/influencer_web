"use client";

import React, { useEffect, useState } from "react";

import { getMyProfile } from "@/service/agency/get_my_profile";
import { AgencyProfileResponse } from "@/types/agency/profile";

import { UnverifiedPageShell } from "./_components/unverified-page-shell";
import { UnverifiedPageSkeleton } from "./_components/unverified-page-skeleton";

export default function UnverifiedPage() {
  const [profile, setProfile] = useState<AgencyProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);
      const response = await getMyProfile();

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

  if (loading) {
    return <UnverifiedPageSkeleton />;
  }

  return <UnverifiedPageShell profile={profile} />;
}
