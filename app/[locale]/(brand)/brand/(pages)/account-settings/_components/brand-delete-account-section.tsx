"use client";

import { useEffect } from "react";
import DeleteAccountDangerZone from "@/components/account-settings/delete-account-danger-zone";
import { useProfileStore } from "@/store/client-profile-store";

const BrandDeleteAccountSection = () => {
  const profile = useProfileStore((state) => state.profile);
  const isLoading = useProfileStore((state) => state.isLoading);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [fetchProfile, profile]);

  const fullName =
    profile?.brandName?.trim() ||
    `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();

  return <DeleteAccountDangerZone fullName={fullName} isLoading={isLoading} />;
};

export default BrandDeleteAccountSection;
