import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from "@/components/ui/popover";
import { FaBell } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TopBar = () => {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-white pl-2 pr-6 py-2.5">
      <div>
        <SidebarTrigger />
      </div>
      <div className="flex gap-6 items-center">
        <div>
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
        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">GrowBig</h2>
            <p className="text-xs font-medium text-muted-foreground ml-1">
              Ad Agency
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
