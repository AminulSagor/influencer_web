import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FiClock, FiInfo } from "react-icons/fi";
import { AiFillTikTok } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa6";
import {
  RiFacebookFill,
  RiInstagramFill,
  RiLinkedinFill,
} from "react-icons/ri";
import type { CampaignApi } from "@/app/[locale]/(brand)/brand/types/client-types";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

type CampaignSummaryCardProps = {
  campaign: CampaignApi;
  label?: string;
};

const formatDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const addDays = (iso: string, days: number) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const daysBetween = (aIso?: string | null, bIso?: string | null) => {
  if (!aIso || !bIso) return null;
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  const diff = Math.ceil((b - a) / (1000 * 60 * 60 * 24));
  return diff;
};

const platformIconMap: Record<string, React.ReactNode> = {
  instagram: <RiInstagramFill className="h-5 w-5" />,
  youtube: <FaYoutube className="h-5 w-5" />,
  tiktok: <AiFillTikTok className="h-5 w-5" />,
  facebook: <RiFacebookFill className="h-5 w-5" />,
  linkedin: <RiLinkedinFill className="h-5 w-5" />,
};

const IconPill = ({ children }: { children: React.ReactNode }) => (
  <div className="h-8 w-8 rounded-md bg-white/95 text-Primary flex items-center justify-center shadow-sm">
    {children}
  </div>
);

const Pill = ({ text }: { text: string }) => (
  <span className="inline-flex items-center rounded-md bg-white/95 px-3 py-1 text-xs font-semibold text-Primary">
    {text}
  </span>
);

export default function CampaignSummaryCard({
  campaign,
  label = "Campaign Details",
}: CampaignSummaryCardProps) {
  const title = campaign.campaignName;

  // best-effort deadline: startingDate + duration
  const endIso =
    campaign.startingDate && campaign.duration
      ? addDays(campaign.startingDate, campaign.duration)
      : null;

  const remaining = endIso
    ? daysBetween(new Date().toISOString(), endIso)
    : null;
  const deadlineLabel =
    remaining == null
      ? "—"
      : remaining <= 0
      ? "Expired"
      : `${remaining} Days Remaining`;
  const deadlineDate = formatDate(endIso);

  // platforms inferred from milestones
  const platforms = Array.from(
    new Set(
      (campaign.milestones ?? []).map((m) => String(m.platform).toLowerCase())
    )
  ).filter(Boolean);

  return (
    <Card className="overflow-hidden bg-linear-to-r from-Primary to-light-green p-0">
      <CardContent className="p-0">
        <div className="px-4 sm:px-6 py-4 sm:py-5 text-white">
          <div className="flex flex-col lg:flex-row items-stretch lg:justify-between gap-5 lg:gap-6">
            {/* left */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-white/90 text-sm min-w-0">
                  <span className="border rounded-full">
                    <ChevronLeft className="h-4 w-4 shrink-0" />
                  </span>
                  <span className="truncate">{label}</span>
                </div>
              </div>

              <h2 className="mt-1 text-xl sm:text-2xl leading-snug truncate">
                {title}
              </h2>

              <div className="mt-4 sm:mt-6 flex items-center gap-4">
                <span className="text-xs text-white/80 shrink-0">
                  Platforms
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {platforms.map((p) => (
                    <IconPill key={p}>
                      {platformIconMap[p] ?? (
                        <span className="text-[10px] font-semibold uppercase">
                          {p.slice(0, 2)}
                        </span>
                      )}
                    </IconPill>
                  ))}
                </div>
              </div>
            </div>

            {/* right */}
            <div className="w-full lg:w-auto flex flex-col lg:flex-row gap-2">
              {campaign.paymentStatus === "partial" && (
                <div className="rounded-lg p-3 h-full border order-2 lg:order-1 bg-linear-to-l from-Primary to-light-green flex flex-col items-center gap-2">
                  <Image src={'/client-panel/money.png'} alt="money img" height={24} width={24}/>
                  <h1 className="text-sm">Total Due</h1>
                  <p className="text-2xl font-semibold">৳4,500</p>
                </div>
              )}
              <div className="order-1">
                <div className="flex flex-col sm:flex-row items-stretch gap-3 lg:justify-end">
                  <div className="w-full sm:min-w-60 lg:w-[320px] rounded-xl border  bg-white/10 px-5 py-4 backdrop-blur-sm bg-linear-to-l from-Primary to-light-green">
                    <div className="text-center text-sm text-white/90">
                      Deadline
                    </div>

                    <div className="mt-2 text-center text-2xl">
                      {deadlineLabel}
                    </div>

                    <div className="mt-2 flex items-center justify-center gap-2 text-sm text-white/90">
                      <FiClock className="h-4 w-4" />
                      <span className="truncate">{deadlineDate}</span>
                    </div>
                  </div>
                </div>

                {/* optional small pill */}
                {campaign.paymentStatus === "pending" && (
                  <div className="mt-3 w-full flex justify-center">
                    <span className="inline-flex items-center rounded-md bg-white px-3 py-2 text-xs font-medium text-Primary">
                      {campaign.paymentStatus === "pending" && "Budget Pending"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
