import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  value: string;
  Icon: React.ElementType;
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
  const isRecentCard = Boolean(date);

  return (
    <div
      className={cn(
        "rounded-lg p-5 space-y-4 bg-linear-to-r from-[#405E2C]/90 to-[#7A9B57]",
        isRecentCard &&
        "bg-linear-to-r from-white to-Secondary border border-light-green/50"
      )}
    >
      <div className="flex items-center justify-between">
        <p className={cn("text-white", isRecentCard && "text-Primary")}>
          {title}
        </p>

        <Icon
          size={35}
          className={cn("text-white", isRecentCard && "text-light-green")}
        />
      </div>

      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-white font-bold text-2xl",
            isRecentCard && "text-Primary"
          )}
        >
          {value}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        {date ? (
          <p className="text-sm text-Primary">{date}</p>
        ) : campaign !== undefined ? (
          <p className="text-off-white text-sm">{campaign} Campaigns</p>
        ) : (
          <div />
        )}

        {linkTitle && (
          <Button variant="link" className="text-white p-0 h-auto">
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