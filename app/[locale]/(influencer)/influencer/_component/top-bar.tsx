"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from "@/components/ui/popover";
import { FaBell } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotifications } from "@/hooks/useNotifications";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getInfluencerProfile } from "@/service/influencer/profile/profile";
import { InfluencerProfileData } from "@/types/influencer/account_setting/profile_type";

const formatRelativeTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const TopBar = () => {
  const {
    notifications,
    loading,
    unreadCount,
    loadingMore,
    handleNotificationsScroll,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [profile, setProfile] = useState<InfluencerProfileData | null>(null);

  useEffect(() => {
    getInfluencerProfile()
      .then(setProfile)
      .catch(() => {});
  }, []);

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : "";
  const initials = profile
    ? `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase()
    : "IN";

  const handleOpenChange = (open: boolean) => {
    if (open) {
      fetchNotifications();
    }
  };

  return (
    <div className="flex items-center justify-between border-b bg-white pl-2 pr-6 py-2.5">
      <div className="flex items-center justify-center gap-4">
        <div>
          <SidebarTrigger />
        </div>
        <div className="hidden md:block">
          <h1 className="text-Primary font-semibold">BrandGuru</h1>
          <h2 className="text-light-gray text-sm">Dashboard</h2>
        </div>
      </div>

      <div className="flex gap-6 items-center">
        <div>
          <Popover onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <button className="relative cursor-pointer border-none bg-transparent p-0" type="button">
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
              sideOffset={5}
              className="relative w-96 p-0 rounded-xl shadow-lg"
            >
              <PopoverArrow
                className="fill-popover stroke-border"
                width={20}
                height={10}
              />

              {/* Sticky header */}
              <div className="px-4 pt-4 pb-3 border-b flex justify-between items-center">
                <h4 className="text-sm font-semibold text-foreground">
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-xs text-light-green font-medium hover:underline focus:outline-none"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="px-2 py-2">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <FaBell size={28} className="text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div className="h-[350px] overflow-y-auto" onScroll={handleNotificationsScroll}>
                    <div className="space-y-1.5 pr-3">
                      {notifications.map((n, index) => {
                        const isUnread = n.isRead === false;

                        return (
                          <div
                            key={n.id ?? `notification-${index}`}
                            onClick={() => {
                              if (isUnread) markAsRead(n.id, false);
                            }}
                            className={`flex gap-3 rounded-lg p-2.5 transition ${
                              isUnread
                                ? "border-l-[3px] border-l-light-green bg-muted/30 hover:bg-muted/60 cursor-pointer"
                                : "bg-transparent opacity-70 border-l-[3px] border-l-transparent hover:bg-muted/10 cursor-default"
                            }`}
                          >
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                isUnread ? "bg-light-green/15" : "bg-muted/50"
                              }`}
                            >
                              <FaBell
                                size={14}
                                className={isUnread ? "fill-light-green" : "fill-muted-foreground"}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-semibold leading-snug text-foreground">
                                {n.title}
                              </p>
                              {n.message && (
                                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                                  {n.message}
                                </p>
                              )}
                              <p className="mt-1 text-[11px] text-muted-foreground/60">
                                {formatRelativeTime(n.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {loadingMore && (
                        <div className="flex items-center justify-center py-3">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={profile?.profileImg ?? ""} alt={fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">
              {fullName || <span className="inline-block w-24 h-5 rounded bg-muted animate-pulse" />}
            </h2>
            <p className="text-xs font-medium text-muted-foreground ml-1">
              Influencer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
