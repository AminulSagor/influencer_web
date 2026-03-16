"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { logout as logoutService } from "@/service/auth/logout";

export function useLogout() {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    if (loading) return;

    setLoading(true);
    try {
      // Call logout service (clears token and calls backend)
      await logoutService();

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
