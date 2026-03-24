"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { removeToken } from "@/utils/cookies_util";
import { useAuthStore } from "@/store/auth_store";

export function useLogout() {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = async () => {
    if (loading) return;

    setLoading(true);
    try {
      removeToken();
      clearAuth();

      router.push(`/${locale}/login`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
