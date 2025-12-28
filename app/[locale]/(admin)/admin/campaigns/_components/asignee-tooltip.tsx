import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { Assignee } from "./admin-campaigns";

type Props = {
  assignees: Assignee[];
};
const AssigneeTooltip = ({ assignees }: Props) => {
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-1">
        {/* avatars row */}
        <div className="flex items-center -space-x-2">
          {assignees.slice(0, 3).map((user) => (
            <Avatar key={user.id} className="h-8 w-8 border-2 border-white">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </div>

        {/* +N indicator (new line) */}
        {assignees.length > 3 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-fit h-6 px-2 flex items-center justify-center text-xs font-medium border border-white cursor-pointer text-light-green underline">
                +{assignees.length - 3} Assigned
              </div>
            </TooltipTrigger>

            <TooltipContent className="p-4 bg-linear-to-br from-white to-Secondary border border-light-green">
              {/* tooltip content unchanged */}

              <div className="space-y-2 ">
                {assignees.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 text-primary p-2 border rounded-md"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-light-green">{user.name}</p>
                      <p className="text-xs text-light-green font-light">
                        Dhaka, Bangladesh
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AssigneeTooltip;
