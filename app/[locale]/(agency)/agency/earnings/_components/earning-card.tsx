import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  value: string;
  Icon: any;
  date?: string;
  link?: string;
  linkTitle?: string;
  campaign?: number;
};

const EarningCard = ({
  title,
  value,
  Icon,
  date,
  link = "/",
  linkTitle,
  campaign,
}: Props) => {
  return (
    <div
      className={cn(
        "bg-linear-to-r from-[#405E2C]/90 to-[#7A9B57] rounded-lg p-5 space-y-4",
        date &&
          "bg-linear-to-r from-white to-Secondary border border-light-green/50"
      )}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <p className={cn("text-white", date && "text-Primary")}>{title}</p>
        <Icon
          size={35}
          className={cn("text-white", date && "text-light-green")}
        />
      </div>

      {/* Value + Link Row */}
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-white font-bold text-2xl",
            date && "text-Primary"
          )}
        >
          {value}
        </p>
      </div>

      <div className="flex items-center justify-between">
        {date && (
          <p className={cn("text-sm", date && "text-Primary")}>{date}</p>
        )}
        {campaign && (
          <p className="text-off-white text-sm">{campaign} Campaigns</p>
        )}
        {linkTitle && (
          <Button variant="link" className="text-white p-0">
            <Link href={link} className="flex items-center">
              {linkTitle} <ChevronRight />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EarningCard;
