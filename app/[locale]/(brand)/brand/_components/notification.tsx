"use client";

import React, { useMemo } from "react";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaBell } from "react-icons/fa";
import {
  ChevronRight,
  Check,
  X,
  Wallet,
  BadgeCheck,
  CreditCard,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import type { NotificationItem } from "@/service/notification-service";

const Notification = () => {
  const {
    notifications,
    loading: isLoading,
    unreadCount,
    fetchNotifications, // ← Add this
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  console.log("Notification component - unreadCount:", unreadCount);
  console.log("Notification component - notifications:", notifications);
  console.log("Notification component - loading:", isLoading);

  // Fetch notifications when popover opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      fetchNotifications();
    }
  };

  const groupedNotifications = useMemo(() => {
    const now = new Date();

    const isRecent = (createdAt: string) => {
      const created = new Date(createdAt);
      const diffMs = now.getTime() - created.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours < 24;
    };

    return {
      newItems: notifications.filter((item) => isRecent(item.createdAt)),
      earlierItems: notifications.filter((item) => !isRecent(item.createdAt)),
    };
  }, [notifications]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}min ago`;
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getNotificationStyle = (type?: string) => {
    switch (type) {
      case "payment_due":
        return {
          icon: <Wallet className="h-4 w-4" />,
          iconWrapperClass:
            "border border-[#A5BE7B] bg-[#F4F8EC] text-[#5F7F2E]",
          titleClass: "text-[#4B6A1F]",
        };

      case "milestone_declined":
      case "name_change_declined":
        return {
          icon: <X className="h-4 w-4" />,
          iconWrapperClass: "border border-[#EF4444] bg-white text-[#EF4444]",
          titleClass: "text-[#EF4444]",
        };

      case "milestone_completed":
        return {
          icon: <Check className="h-4 w-4" />,
          iconWrapperClass:
            "border border-[#A5BE7B] bg-[#F4F8EC] text-[#5F7F2E]",
          titleClass: "text-[#4B6A1F]",
        };

      case "nid_approved":
        return {
          icon: <BadgeCheck className="h-4 w-4" />,
          iconWrapperClass:
            "border border-[#A5BE7B] bg-[#F4F8EC] text-[#5F7F2E]",
          titleClass: "text-[#4B6A1F]",
        };

      case "payout_method_approved":
        return {
          icon: <CreditCard className="h-4 w-4" />,
          iconWrapperClass:
            "border border-[#A5BE7B] bg-[#F4F8EC] text-[#5F7F2E]",
          titleClass: "text-[#4B6A1F]",
        };

      default:
        return {
          icon: <FaBell className="h-3.5 w-3.5" />,
          iconWrapperClass:
            "border border-[#A5BE7B] bg-[#F4F8EC] text-[#5F7F2E]",
          titleClass: "text-[#4B6A1F]",
        };
    }
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    await markAsRead(item.id, item.isRead);
  };

  const renderNotificationItem = (item: NotificationItem) => {
    const style = getNotificationStyle(item.type);

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleNotificationClick(item)}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F9FAF5]"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.iconWrapperClass}`}
        >
          {style.icon}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`line-clamp-2 text-sm leading-5 font-medium ${style.titleClass}`}
          >
            {item.message}
          </p>

          <p className="mt-1 text-xs text-[#8D8D8D]">
            {formatTime(item.createdAt)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-1">
          {!item.isRead && (
            <span className="h-2.5 w-2.5 rounded-full bg-[#7AA141]" />
          )}
          <ChevronRight className="h-4 w-4 text-[#2C2C2C]" />
        </div>
      </button>
    );
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      {" "}
      {/* ← Add this */}
      <PopoverTrigger asChild>
        <button type="button" className="relative cursor-pointer">
          <FaBell size={24} className="fill-light-green" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-600 px-1 text-[10px] leading-none text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={10}
        className="relative w-[430px] overflow-hidden rounded-[12px] border border-[#D6D6D6] bg-white p-0 shadow-none"
      >
        <PopoverArrow
          className="fill-white stroke-[#D6D6D6]"
          width={22}
          height={12}
        />

        <div className="border-b border-[#D6D6D6] px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-semibold text-[#3F5F1D]">
              Notifications
            </h3>

            <button
              type="button"
              onClick={markAllAsRead}
              className="text-sm font-medium text-[#202020] transition-opacity hover:opacity-70"
            >
              Mark All As Read
            </button>
          </div>
        </div>

        <div className="max-h-[520px] overflow-y-auto">
          {isLoading ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No notifications found
            </div>
          ) : (
            <>
              {groupedNotifications.newItems.length > 0 && (
                <div>
                  <div className="border-b border-[#D6D6D6] px-6 py-3">
                    <h4 className="text-sm font-semibold text-[#5A7A2C]">
                      New
                    </h4>
                  </div>

                  <div>
                    {groupedNotifications.newItems.map(renderNotificationItem)}
                  </div>
                </div>
              )}

              {groupedNotifications.earlierItems.length > 0 && (
                <div>
                  <div className="border-y border-[#D6D6D6] px-6 py-3">
                    <h4 className="text-sm font-semibold text-[#5A7A2C]">
                      Earlier
                    </h4>
                  </div>

                  <div>
                    {groupedNotifications.earlierItems.map(
                      renderNotificationItem,
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
