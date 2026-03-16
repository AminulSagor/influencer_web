"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Clock3, BadgeCheck } from "lucide-react";
import { InfluencerProfileData } from "@/types/influencer/account_setting/profile_type";

type Status = "done" | "review" | "rejected" | "pending";

interface VerificationProgressCardProps {
  profileData: InfluencerProfileData | null;
}

export default function VerificationProgressCard({ profileData }: VerificationProgressCardProps) {

  // Determine verification statuses based on profile data
  const basicInfoStatus: Status = profileData?.firstName && profileData?.lastName ? "done" : "pending";
  const socialPortfolioStatus: Status = profileData?.socialLinks && profileData.socialLinks.length > 0 ? "done" : "pending";
  const nidStatus: Status = profileData?.nidVerification?.nidStatus === "verified" || profileData?.nidVerification?.nidStatus === "approved"
    ? "done" 
    : profileData?.nidVerification?.nidStatus === "rejected" 
    ? "rejected"
    : profileData?.nidVerification?.nidStatus === "pending"
    ? "review"
    : "pending";

  // Check if any payout method is verified
  const hasVerifiedPayout = 
    profileData?.payouts?.bank?.some(acc => acc.accStatus === "verified" || acc.accStatus === "approved") ||
    profileData?.payouts?.mobileBanking?.some(acc => acc.accStatus === "verified" || acc.accStatus === "approved");
  
  const hasPendingPayout = 
    profileData?.payouts?.bank?.some(acc => acc.accStatus === "pending") ||
    profileData?.payouts?.mobileBanking?.some(acc => acc.accStatus === "pending");
  
  const hasRejectedPayout = 
    profileData?.payouts?.bank?.some(acc => acc.accStatus === "rejected") ||
    profileData?.payouts?.mobileBanking?.some(acc => acc.accStatus === "rejected");

  const paymentStatus: Status = hasVerifiedPayout
    ? "done"
    : hasRejectedPayout
    ? "rejected"
    : hasPendingPayout
    ? "review"
    : "pending";

  const emailStatus: Status = profileData?.isEmailVerified === true
    ? "done"
    : "pending";

  // Calculate progress percentage
  const totalSteps = 5;
  const completedSteps = [
    basicInfoStatus,
    socialPortfolioStatus,
    nidStatus,
    paymentStatus,
    emailStatus
  ].filter(status => status === "done").length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  // Determine subtitle messages
  const getNidSubtitle = () => {
    if (nidStatus === "done") return "Verified";
    if (nidStatus === "rejected") {
      const reason = profileData?.nidVerification?.nidRejectReason;
      return reason ? `Declined: ${reason}` : "Declined, please resubmit your NID documents";
    }
    if (nidStatus === "review") return "In Review";
    return "Pending";
  };

  const getSocialSubtitle = () => {
    if (socialPortfolioStatus === "done" && profileData?.socialLinks) {
      return `${profileData.socialLinks.length} platform(s) added. You can always add more`;
    }
    return "Pending";
  };

  const getBasicInfoSubtitle = () => {
    if (basicInfoStatus === "done") return "That's How We Are Going To Reach You";
    return "Pending";
  };

  const getPaymentSubtitle = () => {
    if (paymentStatus === "done") return "Verified";
    if (paymentStatus === "rejected") return "Declined, please resubmit your payment information";
    if (paymentStatus === "review") return "In Review";
    return "Pending";
  };

  const getEmailSubtitle = () => {
    if (emailStatus === "done") return "Verified";
    return "Pending";
  };

  
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
                    Verification Progress
                  </h1>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-4 pb-2">
              {/* Progress bar */}
              <div className="h-3 rounded-full bg-light-green/15 overflow-hidden">
                <div 
                  className="h-full bg-light-green rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Timeline list with continuous vertical line */}
              <div className="mt-6">
                <div className="relative">
                  {/* Continuous vertical line */}
                  <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-gray-200 z-0" />
                  
                  {/* Timeline items container */}
                  <div className="relative space-y-7 z-10">
                    <TimelineItem
                      status={basicInfoStatus}
                      title="Basic Informations"
                      sub={getBasicInfoSubtitle()}
                      isFirst={true}
                      isLast={false}
                    />
                    <TimelineItem
                      status={socialPortfolioStatus}
                      title="Social Portfolio"
                      sub={getSocialSubtitle()}
                      isFirst={basicInfoStatus === "done"}
                      isLast={false}
                    />
                    <TimelineItem
                      status={nidStatus}
                      title="NID"
                      sub={getNidSubtitle()}
                      isFirst={socialPortfolioStatus === "done"}
                      isLast={false}
                    />
                    <TimelineItem
                      status={paymentStatus}
                      title="Payment Setup"
                      sub={getPaymentSubtitle()}
                      isFirst={nidStatus === "done"}
                      isLast={false}
                    />
                    <TimelineItem 
                      status={emailStatus} 
                      title="Verify Email" 
                      sub={getEmailSubtitle()} 
                      isFirst={paymentStatus === "done"}
                      isLast={true}
                    />
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
  // Define icon with bolder stroke
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

  // Define bubble colors
  const bubble =
    status === "done"
      ? "bg-light-green"
      : status === "review"
      ? "bg-[#FFF3C9]"
      : status === "rejected"
      ? "bg-[#F8B9B9]"
      : "bg-gray-200";

  // Define line color based on status
  const getLineColor = () => {
    if (status === "done") return "bg-light-green";
    if (status === "review") return "bg-[#FFF3C9]";
    if (status === "rejected") return "bg-[#F8B9B9]";
    return "bg-gray-200";
  };

  return (
    <div className="flex items-start gap-4 relative">
      {/* Left column: icon */}
      <div className="relative flex flex-col items-center">
        <div
          className={`h-12 w-12 rounded-full grid place-items-center relative z-10 ${bubble} border-2 border-white`}
        >
          {icon}
        </div>
        
        {/* Top connector for all items except first */}
        {!isFirst && (
          <div 
            className={`absolute w-[2px] top-[-28px] h-7 ${getLineColor()}`}
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          />
        )}
        
        {/* Bottom connector for all items except last */}
        {!isLast && (
          <div 
            className={`absolute w-[2px] bottom-[-28px] h-7 ${status === "done" ? "bg-light-green" : "bg-gray-200"}`}
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          />
        )}
      </div>

      {/* Right column: text */}
      <div className="pt-3">
        <p className="text-[15px] font-semibold text-Primary">{title}</p>
        <p className="text-xs text-Primary/50 leading-snug mt-0.5">{sub}</p>
      </div>
    </div>
  );
}