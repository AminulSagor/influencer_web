"use client";

import React, { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BadgeCheck, Check, Clock3, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BrandProfile } from "@/types/client/profile/profile";

type Status = "done" | "pending";

type CompletionItem = {
  status: Status;
  title: string;
  sub: string;
  showHelp?: boolean;
  helpText?: string;
};

export default function ProfileCompletionCard({
  profile,
  progress,
}: {
  profile: BrandProfile | null;
  progress: number;
}) {
  const t = useTranslations("brand.unverified.profileCompletion");

  const items = useMemo<CompletionItem[]>(() => {
    if (!profile) return [];

    return [
      {
        status: profile.profileImg ? "done" : "pending",
        title: t("profilePictureTitle"),
        sub: profile.profileImg ? t("done") : t("pending"),
      },
      {
        status: profile.niches?.length ? "done" : "pending",
        title: t("nichesTitle"),
        sub: profile.niches?.length ? t("done") : t("pending"),
        showHelp: true,
        helpText: t("nichesHelp"),
      },
      {
        status: profile.website ? "done" : "pending",
        title: t("websiteTitle"),
        sub: profile.website ? t("done") : t("pending"),
        showHelp: true,
        helpText: t("websiteHelp"),
      },
      {
        status: profile.fullAddress ? "done" : "pending",
        title: t("addressTitle"),
        sub: profile.fullAddress ? t("done") : t("pending"),
      },
    ];
  }, [profile, t]);

  return (
    <Card className="relative bg-white py-0">
      <CardContent className="px-6 py-5">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="py-0 hover:no-underline">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-light-green/15">
                    <BadgeCheck className="h-5 w-5 stroke-[2.5] text-light-green" />
                  </span>
                  <h1 className="text-lg font-semibold text-Primary">
                    {t("title")}
                  </h1>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-4 pb-2">
              <div className="h-3 overflow-hidden rounded-full bg-light-green/15">
                <div
                  className="h-full rounded-full bg-light-green transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute left-6 top-6 bottom-6 z-0 w-[2px] bg-gray-200" />

                  <div className="relative z-10 space-y-7">
                    {items.map((item, index) => (
                      <ProfileItem
                        key={`${item.title}-${index}`}
                        status={item.status}
                        title={item.title}
                        sub={item.sub}
                        isFirst={index === 0}
                        isLast={index === items.length - 1}
                        showHelp={item.showHelp}
                        helpText={item.helpText}
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

function ProfileItem({
  status,
  title,
  sub,
  isFirst = false,
  isLast = false,
  showHelp = false,
  helpText,
}: {
  status: Status;
  title: string;
  sub: string;
  isFirst?: boolean;
  isLast?: boolean;
  showHelp?: boolean;
  helpText?: string;
}) {
  const bubble = status === "done" ? "bg-light-green" : "bg-gray-200";

  const icon =
    status === "done" ? (
      <Check className="h-5 w-5 stroke-[2.5] text-white" />
    ) : (
      <Clock3 className="h-5 w-5 stroke-[2.5] text-gray-400" />
    );

  return (
    <div className="relative flex items-start justify-between gap-4">
      <div className="flex flex-1 items-start gap-4">
        <div className="relative flex flex-col items-center">
          <div
            className={`relative z-10 grid h-12 w-12 place-items-center rounded-full border-2 border-white ${bubble}`}
          >
            {icon}
          </div>

          {!isFirst && (
            <div
              className={`absolute top-[-28px] h-7 w-[2px] ${
                status === "done" ? "bg-light-green" : "bg-gray-200"
              }`}
              style={{ left: "50%", transform: "translateX(-50%)" }}
            />
          )}

          {!isLast && (
            <div
              className="absolute bottom-[-28px] h-7 w-[2px] bg-gray-200"
              style={{ left: "50%", transform: "translateX(-50%)" }}
            />
          )}
        </div>

        <div className="pt-3">
          <p className="text-[15px] font-semibold text-Primary">{title}</p>
          <p className="mt-0.5 text-xs leading-snug text-Primary/50">{sub}</p>
        </div>
      </div>

      {showHelp && helpText && (
        <TooltipProvider delayDuration={120}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="mt-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-light-green text-white outline-none transition hover:opacity-90"
                aria-label={title}
              >
                <HelpCircle className="h-4 w-4 stroke-[2.5]" />
              </button>
            </TooltipTrigger>

            <TooltipContent
              side="left"
              align="center"
              sideOffset={14}
              className="relative max-w-[320px] rounded-[20px] border-none bg-white px-6 py-5 text-Primary shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-light-green text-white">
                  <HelpCircle className="h-4 w-4 stroke-[2.5]" />
                </span>
                <p className="text-base font-medium leading-8 text-light-green">
                  {helpText}
                </p>
              </div>

              <div className="absolute right-[-6px] top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 bg-white" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
