"use client";

import { useEffect } from "react";
import { useProfileStore } from "@/store/client-profile-store";

export default function AccountSettingsNotificationRefresh() {
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    const handler = () => {
      void fetchProfile();
    };

    window.addEventListener("app-data-refresh", handler);

    return () => {
      window.removeEventListener("app-data-refresh", handler);
    };
  }, [fetchProfile]);

  return null;
}
