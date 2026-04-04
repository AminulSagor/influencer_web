"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Invisible client component that listens for FCM push notifications
 * (dispatched as "app-notification" custom events by the useNotifications hook)
 * and triggers a Next.js router.refresh() to re-fetch all server component data
 * on the campaign details page.
 */
const NotificationRefresh = () => {
  const router = useRouter();

  useEffect(() => {
    const handler = () => {
      router.refresh();
    };

    window.addEventListener("app-notification", handler);

    return () => {
      window.removeEventListener("app-notification", handler);
    };
  }, [router]);

  return null;
};

export default NotificationRefresh;
