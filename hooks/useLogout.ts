"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { removeToken } from "@/utils/cookies_util";
import { useAuthStore } from "@/store/auth_store";
import { getFcmToken } from "@/service/firebase/fcm-service";
import { unregisterFcmDevice } from "@/service/firebase/fcm-device-service";

export function useLogout() {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = async () => {
    if (loading) return;

    setLoading(true);
    try {
      // Unregister FCM device (fire-and-forget)
      try {
        const fcmToken = await getFcmToken();
        if (fcmToken) {
          await unregisterFcmDevice(fcmToken);
        }
      } catch {
        // Don't block logout if FCM cleanup fails
      }

      removeToken();
      clearAuth();

    try {
      useProfileStore.getState().resetProfile();

      removeToken();

      router.replace(`/${locale}/login`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
