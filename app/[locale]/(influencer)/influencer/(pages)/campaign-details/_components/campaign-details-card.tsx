"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { BiLeftArrowAlt } from "react-icons/bi";
import { toast } from "sonner";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";
import { AiFillTikTok } from "react-icons/ai";
import { FaFacebookF, FaTwitter } from "react-icons/fa6";

import { InfluencerJobService } from "@/service/influencer/job-service";
import { JobDetail } from "@/types/influencer/job_types";

const platformIconMap: Record<string, React.ReactNode> = {
  instagram: <RiInstagramFill size={20} className="fill-light-green" />,
  youtube: <RiYoutubeFill size={20} className="fill-light-green" />,
  tiktok: <AiFillTikTok size={20} className="fill-light-green" />,
  facebook: <FaFacebookF size={16} className="fill-light-green" />,
  twitter: <FaTwitter size={16} className="fill-light-green" />,
  x: <FaTwitter size={16} className="fill-light-green" />,
};

interface CampaignDetailsCardProps {
  job: JobDetail;
  onStatusChange?: () => void;
  selectedAddressId?: string;
}

const statusBadge: Record<string, { label: string; className: string }> = {
  new_offer: {
    label: "NEW",
    className: "bg-light-green text-white hover:bg-light-green rounded-full px-3 py-0.5 text-[11px] font-medium",
  },
  pending: {
    label: "PENDING",
    className: "bg-orange text-white hover:bg-orange rounded-full px-3 py-0.5 text-[11px] font-medium",
  },
  active: {
    label: "ACTIVE",
    className: "bg-light-green text-white hover:bg-light-green rounded-full px-3 py-0.5 text-[11px] font-medium",
  },
  completed: {
    label: "COMPLETED",
    className: "bg-Primary text-white hover:bg-Primary rounded-full px-3 py-0.5 text-[11px] font-medium",
  },
  declined: {
    label: "DECLINED",
    className: "bg-red-500 text-white hover:bg-red-500 rounded-full px-3 py-0.5 text-[11px] font-medium",
  },
};

const CampaignDetailsCard = ({
  job,
  onStatusChange,
  selectedAddressId,
}: CampaignDetailsCardProps) => {
  const t = useTranslations("influencer.campaign-details");
  const locale = useLocale();

  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [clientTermsChecked, setClientTermsChecked] = useState(false);
  const [appTermsChecked, setAppTermsChecked] = useState(false);

  const badge = statusBadge[job.status] || {
    label: job.status,
    className:
      "bg-gray-400 text-white hover:bg-gray-400 rounded-full px-3 py-0.5 text-[11px] font-medium",
  };

  const showActions = job.status === "new_offer";

  const handleAccept = async () => {
    if (!clientTermsChecked || !appTermsChecked) {
      toast.error("Please accept both terms first.");
      return;
    }

    if (job.campaign.needSampleProduct && !selectedAddressId) {
      toast.error("Please select a delivery address before accepting.");
      return;
    }

    try {
      setAccepting(true);
      const payload = selectedAddressId ? { addressId: selectedAddressId } : undefined;
      await InfluencerJobService.acceptJob(job.id, payload);
      toast.success("Job accepted successfully!");
      onStatusChange?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept job");
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    try {
      setDeclining(true);
      await InfluencerJobService.declineJob(job.id);
      toast.success("Job declined.");
      onStatusChange?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to decline job");
    } finally {
      setDeclining(false);
    }
  };

  const campaignName = job.campaign?.campaignName ?? "";
  const brandName = job.campaign?.client?.brandName ?? "";
  const profileImg = job.campaign?.client?.profileImg ?? "";

  const platforms = Array.from(
    new Set(
      (job.milestones || [])
        .map((m) => m.platform?.toLowerCase())
        .filter((p): p is string => Boolean(p))
    )
  );

  return (
    <Card className="w-full rounded-[22px] border border-[#e9e9e9] bg-white px-6 py-5 shadow-none">
      <div className="space-y-5">
        <Link
          href={`/${locale}/influencer/jobs`}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#9a9a9a] transition-colors hover:text-dark-gray"
        >
          <BiLeftArrowAlt className="text-base" />
          {t("Campaign Details")}
        </Link>

        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-semibold leading-none text-[#365314]">
            {campaignName}
          </h2>
          <Badge className={badge.className}>{badge.label}</Badge>
        </div>

        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profileImg || "/avatar/avatar.png"} />
            <AvatarFallback>{brandName?.charAt(0) || "B"}</AvatarFallback>
          </Avatar>
          <p className="text-[14px] font-medium text-[#f28c28]">{brandName}</p>
        </div>

        {platforms.length > 0 && (
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-normal text-[#9a9a9a]">Platforms</p>

            <div className="flex items-center gap-3">
              {platforms.map((p) => (
                <span key={p} className="flex items-center justify-center">
                  {platformIconMap[p]}
                </span>
              ))}
            </div>
          </div>
        )}

        {showActions ? (
          <>
            <div className="space-y-3 pt-1">
              <div className="flex cursor-pointer items-center gap-3">
                <Checkbox
                  id="terms-client"
                  checked={clientTermsChecked}
                  onCheckedChange={(checked) =>
                    setClientTermsChecked(checked === true)
                  }
                  className="h-5 w-5 rounded-[4px] border-[#d8d8d8] data-[state=checked]:border-light-green data-[state=checked]:bg-light-green"
                />
                <label htmlFor="terms-client" className="text-[14px] leading-[1.3] text-[#a3a3a3] cursor-pointer">
                  Confirm you&apos;ve read the client&apos;s terms &amp; conditions
                </label>
              </div>

              <div className="flex cursor-pointer items-start gap-3">
                <Checkbox
                  id="terms-app"
                  checked={appTermsChecked}
                  onCheckedChange={(checked) => setAppTermsChecked(checked === true)}
                  className="mt-0.5 h-5 w-5 rounded-[4px] border-[#d8d8d8] data-[state=checked]:border-light-green data-[state=checked]:bg-light-green"
                />
                <label htmlFor="terms-app" className="text-[14px] leading-[1.4] text-[#a3a3a3] cursor-pointer">
                  You accept the{" "}
                  <span className="font-medium text-light-green">
                    user license agreement
                  </span>{" "}
                  &amp;{" "}
                  <span className="font-medium text-light-green">
                    Terms and condition
                  </span>{" "}
                  of our app.
                </label>
              </div>
            </div>

            <div className="flex items-center gap-5 pt-1">
              <Button
                className="h-11 flex-1 rounded-full bg-light-green text-[15px] font-medium text-white hover:bg-light-green/90"
                onClick={handleAccept}
                disabled={accepting || declining || !clientTermsChecked || !appTermsChecked}
              >
                {accepting ? "Accepting..." : t("Accept")}
              </Button>

              <Button
                variant="outline"
                className="h-11 flex-1 rounded-full border-[#d0d0d0] bg-white text-[15px] font-medium text-black hover:bg-transparent"
                onClick={handleDecline}
                disabled={accepting || declining}
              >
                {declining ? "Declining..." : t("Decline")}
              </Button>
            </div>
          </>
        ) : (
          <Button className="h-11 w-full rounded-full bg-light-green text-white hover:bg-light-green/90">
            Ongoing Campaign
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CampaignDetailsCard;