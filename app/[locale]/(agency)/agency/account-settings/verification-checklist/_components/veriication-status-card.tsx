import { Card } from "@/components/ui/card";
import React from "react";
import { VerificationStepType } from "../page";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface Props {
  item: VerificationStepType;
  onClick?: () => void;
}

const VerificationStatusCard = ({ item, onClick }: Props) => {
  return (
    <Card
      onClick={onClick}
      className={cn(onClick && "cursor-pointer transition hover:bg-gray-50")}
    >
      <div className="px-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="font-semibold">{item.title}</h2>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "bg-light-green h-2 w-2 rounded-full",
                  item.status === "Unverified" ? "bg-gray-500" : "",
                  item.status === "Under Review" ? "bg-orange" : "",
                )}
              ></div>
              <p
                className={cn(
                  "text-light-green text-xs",
                  item.status === "Unverified" ? "text-gray-500" : "",
                  item.status === "Under Review" ? "text-orange" : "",
                )}
              >
                {item.status}
              </p>
            </div>
          </div>
          <div>
            <ChevronRight />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VerificationStatusCard;
