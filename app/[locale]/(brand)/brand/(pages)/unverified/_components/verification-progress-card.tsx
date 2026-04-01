"use client";

import React, { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Clock3, BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import type {
  BrandProfile,
  VerificationStatus,
} from "@/types/client/profile/profile";

type Status = "done" | "review" | "rejected" | "pending";
type Role = "client" | "agency" | "admin" | "influencer";

type TimelineEntry = {
  status: Status;
  title: string;
  sub: string;
};

function mapVerificationStatus(
  status?: VerificationStatus | string | null,
): Status {
  if (status === "approved") return "done";
  if (status === "pending") return "review";
  if (status === "rejected") return "rejected";
  return "pending";
}

function getStatusLabel(
  status: Status,
  t: ReturnType<typeof useTranslations>,
  rejectReason?: string | null,
) {
  if (status === "done") return t("status.done");
  if (status === "review") return t("status.review");
  if (status === "rejected") {
    return rejectReason
      ? t("status.rejectedWithReason", { reason: rejectReason })
      : t("status.rejected");
  }
  return t("status.pending");
}

export default function VerificationProgressCard({
  role,
  profile,
  progress,
}: {
  role?: Role;
  profile: BrandProfile | null;
  progress: number;
}) {
  const t = useTranslations("brand.unverified.verification");

  const timelineItems = useMemo<TimelineEntry[]>(() => {
    const items: TimelineEntry[] = [
      {
        status: "done",
        title: t("basicInformationTitle"),
        sub: t("basicInformationSub"),
      },
    ];

    if (!profile) return items;

    const socialStatus: Status = profile.socialLinks?.length
      ? profile.socialLinks.some((item) => item.status === "rejected")
        ? "rejected"
        : profile.socialLinks.some((item) => item.status === "pending")
          ? "review"
          : profile.socialLinks.every((item) => item.status === "approved")
            ? "done"
            : "pending"
      : "pending";

    items.push({
      status: socialStatus,
      title: t("socialPortfolioTitle"),
      sub: getStatusLabel(socialStatus, t),
    });

    const nidStatus = mapVerificationStatus(profile.nidVerification?.nidStatus);
    items.push({
      status: nidStatus,
      title: t("nidTitle"),
      sub: getStatusLabel(
        nidStatus,
        t,
        profile.nidVerification?.nidRejectReason,
      ),
    });

    if (role !== "influencer") {
      const tradeStatus = mapVerificationStatus(
        profile.tradeLicenseVerification?.tradeLicenseStatus,
      );
      items.push({
        status: tradeStatus,
        title: t("tradeLicenseTitle"),
        sub: getStatusLabel(
          tradeStatus,
          t,
          profile.tradeLicenseVerification?.tradeLicenseRejectReason,
        ),
      });

      const tinStatus = mapVerificationStatus(
        profile.tinVerification?.tinStatus,
      );
      items.push({
        status: tinStatus,
        title: t("tinTitle"),
        sub: getStatusLabel(
          tinStatus,
          t,
          profile.tinVerification?.tinRejectReason,
        ),
      });

      const binStatus = mapVerificationStatus(
        profile.binVerification?.binStatus,
      );
      items.push({
        status: binStatus,
        title: t("binTitle"),
        sub: getStatusLabel(
          binStatus,
          t,
          profile.binVerification?.binRejectReason,
        ),
      });
    }

    items.push({
      status: profile.isEmailVerified ? "done" : "pending",
      title: t("emailTitle"),
      sub: profile.isEmailVerified ? t("status.done") : t("status.pending"),
    });

    return items;
  }, [profile, role, t]);

  return (
    <Card className="py-0 relative bg-white">
      <CardContent className="py-5 px-6">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="py-0 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 rounded-full bg-light-green/15 grid place-items-center">
                    <BadgeCheck className="w-5 h-5 text-light-green stroke-[2.5]" />
                  </span>
                  <h1 className="font-semibold text-lg text-Primary">
                    {t("title")}
                  </h1>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-4 pb-2">
              <div className="h-3 rounded-full bg-light-green/15 overflow-hidden">
                <div
                  className="h-full bg-light-green rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-gray-200 z-0" />

                  <div className="relative space-y-7 z-10">
                    {timelineItems.map((item, index) => (
                      <TimelineItem
                        key={`${item.title}-${index}`}
                        status={item.status}
                        title={item.title}
                        sub={item.sub}
                        isFirst={index === 0}
                        isLast={index === timelineItems.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function TimelineItem({
  status,
  title,
  sub,
  isFirst = false,
  isLast = false,
}: {
  status: Status;
  title: string;
  sub: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const icon =
    status === "done" ? (
      <Check className="w-5 h-5 text-white stroke-[2.5]" />
    ) : status === "review" ? (
      <Clock3 className="w-5 h-5 text-[#B77900] stroke-[2.5]" />
    ) : status === "rejected" ? (
      <X className="w-5 h-5 text-[#E74C3C] stroke-[2.5]" />
    ) : (
      <Clock3 className="w-5 h-5 text-gray-400 stroke-[2.5]" />
    );

  const bubble =
    status === "done"
      ? "bg-light-green"
      : status === "review"
        ? "bg-[#FFF3C9]"
        : status === "rejected"
          ? "bg-[#F8B9B9]"
          : "bg-gray-200";

  const getLineColor = () => {
    if (status === "done") return "bg-light-green";
    if (status === "review") return "bg-[#FFF3C9]";
    if (status === "rejected") return "bg-[#F8B9B9]";
    return "bg-gray-200";
  };

  return (
    <div className="flex items-start gap-4 relative">
      <div className="relative flex flex-col items-center">
        <div
          className={`h-12 w-12 rounded-full grid place-items-center relative z-10 ${bubble} border-2 border-white`}
        >
          {icon}
        </div>

        {!isFirst && (
          <div
            className={`absolute w-[2px] top-[-28px] h-7 ${getLineColor()}`}
            style={{ left: "50%", transform: "translateX(-50%)" }}
          />
        )}

        {!isLast && (
          <div
            className={`absolute w-[2px] bottom-[-28px] h-7 ${
              status === "done" ? "bg-light-green" : "bg-gray-200"
            }`}
            style={{ left: "50%", transform: "translateX(-50%)" }}
          />
        )}
      </div>

      <div className="pt-3">
        <p className="text-[15px] font-semibold text-Primary">{title}</p>
        <p className="text-xs text-Primary/50 leading-snug mt-0.5">{sub}</p>
      </div>
    </div>
  );
}
