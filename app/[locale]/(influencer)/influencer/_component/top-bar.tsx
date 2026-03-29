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
import { useState, useEffect } from "react";
import { getNotifications } from "@/service/influencer/notifications";
import { NotificationItem } from "@/types/influencer/dashboard/notifications";

const TopBar = () => {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications("new");
        setNotifications(res.data);
        setUnreadCount(res.meta.total);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

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
          {mounted ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative cursor-pointer border-none bg-transparent p-0" type="button">
                  <FaBell size={24} className="fill-light-green" />

                  {/* 🔴 Notification count */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-600 px-1 text-[10px]  leading-none text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="end"
                sideOffset={5}
                className="relative w-80 p-0"
              >
                {/* 🔺 Caret */}
                <PopoverArrow
                  className="fill-popover stroke-border"
                  width={20}
                  height={10}
              />

              {/* Notification content */}
              <div className="p-4">
                <h4 className="mb-2 text-sm font-semibold">Notifications</h4>

                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`text-sm rounded p-2 ${!n.isRead ? "bg-yellow-50" : ""}`}
                      >
                        <p className="font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>          ) : (
            <button className="relative cursor-pointer border-none bg-transparent p-0" type="button">
              <FaBell size={24} className="fill-light-green" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-600 px-1 text-[10px]  leading-none text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          )}        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">Hania Amir</h2>
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
