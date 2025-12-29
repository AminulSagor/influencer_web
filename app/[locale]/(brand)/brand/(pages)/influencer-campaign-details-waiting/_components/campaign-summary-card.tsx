import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FiInfo, FiClock, FiInstagram } from "react-icons/fi";
import { FaYoutube, FaTiktok } from "react-icons/fa6";

type CampaignDetailsCardProps = {
  label?: string;
  title?: string;
  remainingText?: string;
  dateText?: string;
  statusText?: string;
};

const IconPill = ({ children }: { children: React.ReactNode }) => (
  <div className="h-8 w-8 rounded-md bg-white/95 text-Primary flex items-center justify-center shadow-sm">
    {children}
  </div>
);

const CampaignSummaryCard = ({
  label = "Campaign Details",
  title = "Summer Fashion Campaign",
  remainingText = "4 Days Remaining",
  dateText = "Dec 15, 2025",
  statusText = "Budget Pending",
}: CampaignDetailsCardProps) => {
  return (
    <Card className="overflow-hidden bg-linear-to-r from-Primary to-light-green p-0">
      <CardContent className="p-0">
        <div className="rounded-2xl  px-6 py-5 text-white">
          <div className="flex flex-col md:flex-row items-stretch md:justify-between gap-6">
            {/* LEFT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <FiInfo className="h-4 w-4" />
                <span>{label}</span>
              </div>

              <h2 className="mt-1 text-2xl font-semibold leading-snug truncate">
                {title}
              </h2>

              <div className="mt-6 h-px w-72 max-w-full bg-white/25" />

              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs text-white/80">Platforms</span>
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
            <div className="flex flex-col items-end justify-between">
              <div className="w-full md:w-60 rounded-xl border border-white/25 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <div className="text-right text-sm text-white/90">Deadline</div>

                <div className="mt-2 text-right text-2xl font-semibold">
                  {remainingText}
                </div>

                <div className="mt-2 flex items-center justify-end gap-2 text-sm text-white/90">
                  <FiClock className="h-4 w-4" />
                  <span>{dateText}</span>
                </div>
              </div>

              <div className="mt-3 w-full md:w-60 md:flex md:justify-center">
                <span className="inline-flex items-center rounded-md bg-white px-3 py-1 text-xs font-medium text-Primary">
                  {statusText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignSummaryCard;
