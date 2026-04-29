"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { RiUser3Fill } from "react-icons/ri";
import { FaClock, FaArrowRightLong } from "react-icons/fa6";
import { ChevronRight } from "lucide-react";
import { Campaign } from "@/types/client/campaigns/campaign";
import { formatDeadline, getDueDays } from "@/utils/date_util";
import { formatBudget } from "@/utils/fomat_budget_utils";

type Props = {
  data?: Campaign[];
};

const WorkInProgressCard = ({ data = [] }: Props) => {
  const t = useTranslations("influencer.dashboard.workInProgress");
  const router = useRouter();
  const campaigns = data.slice(0, 3);

  const formatCampaignType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getAssignedText = (assignedTo: Campaign["assignedTo"]) => {
    if (!assignedTo?.length) return "Unknown";
    const firstName = assignedTo[0].name;
    const extraCount = assignedTo.length - 1;
    return extraCount > 0 ? `${firstName}+${extraCount}` : firstName;
  };

  if (!campaigns.length) {
    return (
      <Card className="h-full w-full rounded-[24px] border border-[#D9D9D9] shadow-none">
        <CardHeader>
          <CardTitle className="text-[24px] font-semibold text-[#2D5016]">
            {t("title")}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center text-sm text-muted-foreground">
          No active campaigns found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-[#2D5016]">
          {t("title")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="rounded-[24px] border border-[#D9D9D9] px-7 py-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-[18px] font-semibold text-[#2D5016]">
                  {campaign.campaignName}
                </h3>

                <p className="mt-1 text-[14px] font-medium text-[#8D8D8D]">
                  {formatCampaignType(campaign.campaignType)}
                </p>

                <p className="mt-3 text-[20px] font-medium text-[#7A9B57]">
                  {formatBudget(campaign.totalBudget)}
                </p>

                <div className="mt-3 flex items-center gap-2 text-[#D97A1D]">
                  <RiUser3Fill className="shrink-0 text-[14px]" />
                  <span className="text-[14px] font-medium">
                    {getAssignedText(campaign.assignedTo)}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-[#D97A1D]">
                  <FaClock className="shrink-0 text-[12px]" />
                  <span className="text-[14px] font-medium">
                    {formatDeadline(campaign.deadline)}
                  </span>
                </div>
              </div>

              <div className="shrink-0 rounded-[14px] border border-[#E08A2E] px-4 py-2 text-[14px] font-medium text-[#E08A2E]">
                {getDueDays(campaign.deadline)}
              </div>
            </div>

            <div className="mt-4">
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#D9E2CF]">
                <div
                  className="h-full rounded-full bg-[#7A9B57] transition-all"
                  style={{ width: `${campaign.progress}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-[14px] font-medium text-[#D97A1D]">
                  {campaign.progress}% {t("complete")}
                </p>

                <Link
                  href={`/brand/campaign-details/${campaign.id}`}
                  className="flex items-center gap-1 text-[14px] font-medium text-[#2F2F2F]"
                >
                  {t("view")}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="justify-center pt-2">
        <Button
          className="w-full max-w-[420px] rounded-md border border-[#A6BE7A] bg-[#EEF3DD] text-base font-medium text-[#2D5016] shadow-none hover:bg-[#E7EECE] hover:text-[#2D5016]"
          onClick={() => router.push("/brand/campaigns")}
        >
          {t("viewAllJobs")}
          <FaArrowRightLong />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkInProgressCard;
