"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { logout as logoutService } from "@/service/auth/logout";
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
      // Call logout service (clears token and calls backend)
      await logoutService();
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

      // Redirect to login page
      router.push(`/${locale}/login`);
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if there's an error, redirect to login since token is cleared
      router.push(`/${locale}/login`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
