import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FiInfo, FiClock, FiInstagram } from "react-icons/fi";
import { FaYoutube, FaTiktok } from "react-icons/fa6";

type CampaignDetailsCardProps = {
  pending?: boolean;

  label?: string;
  title?: string;
  remainingText?: string;
  dateText?: string;

  // pending
  statusText?: string;

  // not pending (due section)
  dueLabel?: string;
  dueAmount?: number;

  // optional influencers row (only shown when not pending in your ss)
  influencers?: string[];
};

const formatBDT = (n: number) => `৳${n.toLocaleString("en-US")}`;

const IconPill = ({ children }: { children: React.ReactNode }) => (
  <div className="h-8 w-8 rounded-md bg-white/95 text-Primary flex items-center justify-center shadow-sm">
    {children}
  </div>
);

const AvatarDot = () => (
  <span className="h-5 w-5 rounded-full bg-white/35 ring-1 ring-white/25" />
);

const CampaignSummaryCard = ({
  pending = false,

  label = "Campaign Details",
  title = "Summer Fashion Campaign",
  remainingText = "4 Days Remaining",
  dateText = "Dec 15, 2025",

  statusText = "Budget Pending",

  dueLabel = "Total Due",
  dueAmount = 4500,

  influencers = ["Hanic Amir", "Salman Khan", "John Smith"],
}: CampaignDetailsCardProps) => {
  const showDue = !pending && typeof dueAmount === "number";

  return (
    <Card className="overflow-hidden bg-linear-to-r from-Primary to-light-green p-0">
      <CardContent className="p-0">
        <div className="px-4 sm:px-6 py-4 sm:py-5 text-white">
          <div className="flex flex-col lg:flex-row items-stretch lg:justify-between gap-5 lg:gap-6">
            {/* LEFT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <FiInfo className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </div>

              <h2 className="mt-1 text-xl sm:text-2xl font-semibold leading-snug truncate">
                {title}
              </h2>

              {!pending && (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-1.5">
                    <AvatarDot />
                    <AvatarDot />
                    <AvatarDot />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                    <span className="text-xs text-white/85 shrink-0">
                      Influencers:
                    </span>

                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      {influencers.slice(0, 5).map((name) => (
                        <span
                          key={name}
                          className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-Primary max-w-full"
                          title={name}
                        >
                          <span className="truncate max-w-[160px]">{name}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="h-px w-full max-w-[420px] bg-white/25" />
                </div>
              )}

              {pending && (
                <div className="mt-6 h-px w-72 max-w-full bg-white/25" />
              )}

              <div className="mt-4 sm:mt-6 flex items-center gap-4">
                <span className="text-xs text-white/80 shrink-0">
                  Platforms
                </span>
                <div className="flex items-center gap-2">
                  <IconPill>
                    <FiInstagram className="h-4 w-4" />
                  </IconPill>
                  <IconPill>
                    <FaYoutube className="h-4 w-4" />
                  </IconPill>
                  <IconPill>
                    <FaTiktok className="h-4 w-4" />
                  </IconPill>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-auto">
              <div
                className={[
                  "flex flex-col sm:flex-row lg:flex-row items-stretch gap-3",
                  "lg:justify-end",
                ].join(" ")}
              >
                {showDue && (
                  <div className="w-full sm:w-[170px] lg:w-[170px] rounded-xl border border-white/25 bg-white/10 px-5 py-4 backdrop-blur-sm flex flex-col items-center justify-center text-center">
                    <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center border border-white/25">
                      <span className="text-white/95 font-semibold">৳</span>
                    </div>

                    <div className="mt-2 text-sm text-white/90">{dueLabel}</div>

                    <div className="mt-2 text-2xl font-semibold">
                      {formatBDT(dueAmount)}
                    </div>
                  </div>
                )}

                <div className="w-full sm:flex-1 sm:min-w-[240px] lg:w-[320px] rounded-xl border border-white/25 bg-white/10 px-5 py-4 backdrop-blur-sm">
                  <div className="text-center text-sm text-white/90">
                    Deadline
                  </div>

                  <div className="mt-2 text-center text-2xl font-semibold">
                    {remainingText}
                  </div>

                  <div className="mt-2 flex items-center justify-center gap-2 text-sm text-white/90">
                    <FiClock className="h-4 w-4" />
                    <span className="truncate">{dateText}</span>
                  </div>
                </div>
              </div>

              {/* Status (only pending, as per ss 1) */}
              {pending && (
                <div className="mt-3 w-full flex justify-center lg:justify-end">
                  <span className="inline-flex items-center rounded-md bg-white px-3 py-1 text-xs font-medium text-Primary">
                    {statusText}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignSummaryCard;
