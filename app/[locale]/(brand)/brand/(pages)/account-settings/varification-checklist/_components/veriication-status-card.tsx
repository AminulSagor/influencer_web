"use client";

import { Card } from "@/components/ui/card";
import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { VerificationStepType } from "../page";

interface Props {
  item: VerificationStepType;
  onClick?: () => void;
}

const VerificationStatusCard = ({ item, onClick }: Props) => {
  const t = useTranslations("brand.verificationChecklist");

  const isVerified = item.status === "verified";
  const isUnverified = item.status === "unverified";
  const isUnderReview = item.status === "underReview";
  const isRejected = item.status === "rejected";

  return (
    <Card
      onClick={onClick}
      className={cn(
        "py-4",
        onClick && "cursor-pointer transition hover:bg-gray-50",
      )}
    >
      <div className="px-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="font-semibold text-gray-600">{item.title}</h2>

            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  isVerified && "bg-light-green",
                  isUnverified && "bg-gray-500",
                  isUnderReview && "bg-orange",
                  isRejected && "bg-red-500",
                )}
              />

              <p
                className={cn(
                  "text-xs font-semibold",
                  isVerified && "text-green-500",
                  isUnverified && "text-gray-500",
                  isUnderReview && "text-orange",
                  isRejected && "text-red-500",
                )}
              >
                {t(item.status)}
              </p>
            </div>
          </div>

          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );
};

export default VerificationStatusCard;
