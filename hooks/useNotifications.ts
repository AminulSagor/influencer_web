"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { isSupported } from "firebase/messaging";
import app from "@/lib/firebase";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  NotificationItem,
} from "@/service/admin/notification-service";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const listenerSetUp = useRef(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications(1, 10);
      console.log(res.data);
      setNotifications(res.data);
      // Initialize unread count from the server response
      if (res.meta && res.meta.unreadCount !== undefined) {
        setUnreadCount(res.meta.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(
    async (id: string, currentlyRead?: boolean) => {
      if (currentlyRead) return;

      // Optimistically update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await markNotificationAsRead(id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
        // Could revert state here on failure if needed
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    if (unreadCount === 0) return;

    // Optimistically update local state
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  }, [unreadCount]);

  // Listen for FCM foreground messages
  useEffect(() => {
    if (listenerSetUp.current) return;
    listenerSetUp.current = true;

    // Initial fetch of notifications
    fetchNotifications();

    const setup = async () => {
      try {
        if (typeof window === "undefined") return;
        const supported = await isSupported();
        if (!supported) return;

        const messaging = getMessaging(app);

        onMessage(messaging, (payload) => {
          // Firebase suppresses native OS popups when the app is in the foreground
          // So we manually trigger the Notification API here
          if (payload.notification && Notification.permission === "granted") {
            const { title, body, icon } = payload.notification;
            new Notification(title || "New Notification", {
              body,
              icon: icon || "/favicon.ico",
            });
          }

          // A new push arrived while the app is in the foreground
          // Increment unread count, refetch, and broadcast
          setUnreadCount((prev) => prev + 1);
          fetchNotifications();
          window.dispatchEvent(new CustomEvent("app-notification", { detail: payload }));
        });
      } catch (err) {
        console.error("FCM onMessage setup error:", err);
      }
    };

    setup();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
