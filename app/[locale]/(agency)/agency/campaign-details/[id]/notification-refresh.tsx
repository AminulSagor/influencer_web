"use client";

import { useEffect, startTransition } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";

/**
 * Invisible client component that listens for FCM push notifications
 * (dispatched as "app-notification" custom events by the useNotifications hook)
 * and triggers a Next.js router.refresh() ONLY if the notification is relevant
 * to the current page context.
 */
const NotificationRefresh = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      const payload = customEvent.detail;

      // Extract the custom data block pushed securely by the backend
      const pushData = payload?.data;

      if (!pushData) return; // Ignore notifications without contextual metadata

      // Evaluate if the notification concerns the currently viewed content
      const isTargetingCurrentContext = () => {
        // Strategy 1: URL/Path matching
        // If the backend defines a target link for the notification
        if (pushData.url && pathname.includes(pushData.url)) return true;
        if (pushData.link && pathname.includes(pushData.link)) return true;

        // Strategy 2: Entity ID matching
        // If the backend passes the specific entity ID
        const currentCampaignId = params?.id as string | undefined;

        if (currentCampaignId) {
          if (pushData.campaignId === currentCampaignId) return true;
          if (pushData.entityId === currentCampaignId) return true;
        }

        return false;
      };

      if (isTargetingCurrentContext()) {
        startTransition(() => {
          router.refresh();
        });
      }
    };

    window.addEventListener("app-notification", handler);

    return () => {
      window.removeEventListener("app-notification", handler);
    };
  }, [router, params, pathname]);

  return null;
};

export default NotificationRefresh;
