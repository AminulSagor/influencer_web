import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { FaBell } from "react-icons/fa";

const Notification = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <FaBell size={24} className="fill-light-green" />

          {/* 🔴 Notification count */}
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-600 px-1 text-[10px]  leading-none text-white">
            3
          </span>
        </div>
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
            <div className="text-sm">🔔 New comment on your post</div>
            <div className="text-sm">✅ Task “UI Review” completed</div>
            <div className="text-sm text-muted-foreground">
              No more notifications
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
