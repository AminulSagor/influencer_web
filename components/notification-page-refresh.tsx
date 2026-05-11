"use client";

import { startTransition, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const stripLocale = (path: string) =>
  path.replace(/^\/(en|bn)(?=\/|$)/, "") || "/";

const shouldRefreshForPath = (path: string) => {
  const normalizedPath = stripLocale(path);

  if (normalizedPath === "/brand/campaigns") return true;
  if (normalizedPath === "/brand/account-settings") return true;
  if (
    normalizedPath.startsWith("/brand/campaign-details/") &&
    normalizedPath.endsWith("/details")
  ) {
    return true;
  }

  if (normalizedPath === "/agency/account-settings") return true;
  if (normalizedPath.startsWith("/agency/jobs")) return true;
  if (normalizedPath.startsWith("/agency/campaign-details/")) return true;

  if (normalizedPath === "/influencer/account-settings") return true;
  if (normalizedPath.startsWith("/influencer/jobs")) return true;
  if (normalizedPath.startsWith("/influencer/campaign-details/")) return true;

  return false;
};

export default function NotificationPageRefresh() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => {
      if (!shouldRefreshForPath(pathname)) return;

      window.dispatchEvent(new Event("app-data-refresh"));

      startTransition(() => {
        router.refresh();
      });
    };

    window.addEventListener("app-notification", handler);

    return () => {
      window.removeEventListener("app-notification", handler);
    };
  }, [pathname, router]);

  return null;
}
