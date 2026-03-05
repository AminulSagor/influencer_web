"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";

export function useLogout() {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await fetch("/service/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      router.push(`/${locale}/login`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
