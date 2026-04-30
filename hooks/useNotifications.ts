"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UIEvent } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { isSupported } from "firebase/messaging";
import app from "@/lib/firebase";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/service/notification-service";
import type { NotificationItem } from "@/service/notification-service";

const NOTIFICATION_LIMIT = 10;

const dedupeNotifications = (items: NotificationItem[]) => {
  const seen = new Set<string>();

  return items.filter((item, index) => {
    const key = item.id || `${item.createdAt}-${index}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const listenerSetUp = useRef(false);

  const fetchNotifications = useCallback(async (nextPage = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await getNotifications(nextPage, NOTIFICATION_LIMIT);
      const data = Array.isArray(res.data) ? res.data : [];
      const meta = res.meta;
      const currentPage = Number(meta?.page ?? nextPage);
      const limit = Number(meta?.limit ?? NOTIFICATION_LIMIT);
      const total = Number(meta?.total ?? data.length);
      const totalPages = Number(meta?.totalPages ?? Math.ceil(total / limit));

      setNotifications((prev) =>
        append ? dedupeNotifications([...prev, ...data]) : data,
      );
      setPage(currentPage);
      setHasMore(totalPages > 0 ? currentPage < totalPages : data.length >= limit);

      if (meta && meta.unreadCount !== undefined) {
        setUnreadCount(meta.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchNextPage = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;
    void fetchNotifications(page + 1, true);
  }, [fetchNotifications, hasMore, loading, loadingMore, page]);

  const handleNotificationsScroll = useCallback(
    (event: UIEvent<HTMLElement>) => {
      const target = event.currentTarget;
      const distanceFromBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight;

      if (distanceFromBottom <= 80) {
        fetchNextPage();
      }
    },
    [fetchNextPage],
  );

  const markAsRead = useCallback(
    async (id: string, currentlyRead?: boolean) => {
      if (currentlyRead) return;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await markNotificationAsRead(id);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    },
    [],
  );

  const markAllAsRead = useCallback(async () => {
    if (unreadCount === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  }, [unreadCount]);

  useEffect(() => {
    if (listenerSetUp.current) return;
    listenerSetUp.current = true;

    fetchNotifications();

    let unsubscribe: any = null;
    let isMounted = true;

    const setup = async () => {
      try {
        if (typeof window === "undefined") return;
        const supported = await isSupported();
        if (!supported) return;

        const messaging = getMessaging(app);

        const unsub = onMessage(messaging, (payload) => {
          if (payload.notification && Notification.permission === "granted") {
            const { title, body, icon } = payload.notification;
            new Notification(title || "New Notification", {
              body,
              icon: icon || "/favicon.ico",
            });
          }

          setUnreadCount((prev) => prev + 1);
          fetchNotifications();
          window.dispatchEvent(
            new CustomEvent("app-notification", { detail: payload }),
          );
        });

        if (isMounted) {
          unsubscribe = unsub;
        } else {
          unsub();
        }
      } catch (err) {
        console.error("FCM onMessage setup error:", err);
      }
    };

    setup();

    return () => {
      isMounted = false;
      listenerSetUp.current = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    loadingMore,
    unreadCount,
    hasMore,
    fetchNotifications,
    fetchNextPage,
    handleNotificationsScroll,
    markAsRead,
    markAllAsRead,
  };
}
