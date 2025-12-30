import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { FiClock, FiInfo } from "react-icons/fi";
import { AiFillTikTok } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa6";
import { RiFacebookFill, RiInstagramFill, RiLinkedinFill } from "react-icons/ri";
import { campaignMocksData } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/data";

type CampaignDetails = (typeof campaignMocksData)[number];

type CampaignSummaryCardProps = {
  campaign: CampaignDetails;
  label?: string;
};

const formatBDT = (n: number) => `৳${n.toLocaleString("en-US")}`;

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
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

const AvatarDot = () => (
  <span className="h-5 w-5 rounded-full bg-white/35 ring-1 ring-white/25" />
);

const CampaignSummaryCard = ({
  campaign,
  label = "Campaign Details",
}: CampaignSummaryCardProps) => {
  const influencers =
    campaign.influencerCampaigns?.map((x) => x.influencer.name) ?? [];

  const dueAmount = campaign.quote?.dueAmount?.amount ?? 0;

  const tabStatus = campaign.tabStatus ?? "";
  const stage = campaign.stage ?? "";
  const quoteStatus = campaign.quote?.statusLabel ?? "";

  const isPending =
    tabStatus.toLowerCase() === "pending" ||
    stage.toLowerCase() === "quoted" ||
    quoteStatus === "PENDING";

  const showDue = !isPending && dueAmount > 0;

  const deadlineLabel = campaign.deadline?.daysRemainingLabel ?? "—";
  const deadlineDate = formatDate(campaign.deadline?.date);

  // Brand safe fallback
  const brandLogo = campaign.brand?.logoUrl || "/avatar/avatar.png";
  const brandName = campaign.brand?.name || "—";

  // Status pill text (you said: "campaign have status and use this")
  // Here “status” = tabStatus + stage
  const statusPillText = [tabStatus, stage].filter(Boolean).join(" • ");

  return (
    <Card className="overflow-hidden bg-linear-to-r from-Primary to-light-green p-0">
      <CardContent className="p-0">
        <div className="px-4 sm:px-6 py-4 sm:py-5 text-white">
          <div className="flex flex-col lg:flex-row items-stretch lg:justify-between gap-5 lg:gap-6">
            {/* LEFT */}
            <div className="flex-1 min-w-0">
              {/* top row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-white/90 text-sm min-w-0">
                  <FiInfo className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </div>

                {statusPillText && <Pill text={statusPillText} />}
              </div>

              {/* title */}
              <h2 className="mt-1 text-xl sm:text-2xl font-semibold leading-snug truncate">
                {campaign.title}
              </h2>

              {/* brand row */}
              <div className="mt-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-white/20 ring-1 ring-white/20 shrink-0">
                  <Image
                    src={brandLogo}
                    alt={brandName}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-xs text-white/80">Brand</div>
                  <div className="text-sm font-semibold truncate">{brandName}</div>
                </div>
              </div>

              {/* influencers (only when NOT pending) */}
              {!isPending && influencers.length > 0 && (
                <div className="mt-4 space-y-3">
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
                      {influencers.length > 5 && (
                        <span className="text-xs text-white/85">
                          +{influencers.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="h-px w-full max-w-[420px] bg-white/25" />
                </div>
              )}

              {/* platforms */}
              <div className="mt-4 sm:mt-6 flex items-center gap-4">
                <span className="text-xs text-white/80 shrink-0">Platforms</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {(campaign.platforms ?? []).map((p) => (
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

            {/* RIGHT */}
            <div className="w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row items-stretch gap-3 lg:justify-end">
                {showDue && (
                  <div className="w-full sm:w-[170px] rounded-xl border border-white/25 bg-white/10 px-5 py-4 backdrop-blur-sm flex flex-col items-center justify-center text-center">
                    <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center border border-white/25">
                      <span className="text-white/95 font-semibold">৳</span>
                    </div>

                    <div className="mt-2 text-sm text-white/90">Total Due</div>

                    <div className="mt-2 text-2xl font-semibold">
                      {formatBDT(dueAmount)}
                    </div>
                  </div>
                )}

                <div className="w-full sm:min-w-[240px] lg:w-[320px] rounded-xl border border-white/25 bg-white/10 px-5 py-4 backdrop-blur-sm">
                  <div className="text-center text-sm text-white/90">Deadline</div>

                  <div className="mt-2 text-center text-2xl font-semibold">
                    {deadlineLabel}
                  </div>

                  <div className="mt-2 flex items-center justify-center gap-2 text-sm text-white/90">
                    <FiClock className="h-4 w-4" />
                    <span className="truncate">{deadlineDate}</span>
                  </div>
                </div>
              </div>

              {/* pending-only label */}
              {isPending && (
                <div className="mt-3 w-full flex justify-center lg:justify-end">
                  <span className="inline-flex items-center rounded-md bg-white px-3 py-1 text-xs font-medium text-Primary">
                    {quoteStatus === "PENDING" ? "Budget Pending" : "Pending"}
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
