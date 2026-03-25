"use client";

import { useTranslations } from "next-intl";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CampaignMilestone,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import {
  SubmissionDetail,
  SubmissionSummary,
} from "@/types/client/campaigns/campaign-submission.types";
import {
  formatSubmissionStatusLabel,
  getSubmissionStatusClasses,
} from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-ui.helpers";
import { useSubmissionDetails } from "@/hooks/use-submission-details";
import SubmissionDetailsPanel from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/influencer-submission-details-panel";

type Props = {
  submission: SubmissionSummary;
  index: number;
  campaign: ClientCampaignDetails;
  milestone: CampaignMilestone;
  isOpen: boolean;
  prefetchedDetail?: SubmissionDetail | null;
};

export default function SubmissionAccordionItem({
  submission,
  index,
  campaign,
  milestone,
  isOpen,
  prefetchedDetail,
}: Props) {
  const t = useTranslations("brand.CampaignDetailsPage");

  const { item, isLoading, error } = useSubmissionDetails({
    submissionId: submission.id,
    enabled: isOpen,
    campaignType: campaign.campaignType,
    prefetchedDetail,
  });

  const statusClasses = getSubmissionStatusClasses(submission.status);
  const statusLabel = formatSubmissionStatusLabel(submission.status);

  const title =
    campaign.campaignType === "influencer_promotion"
      ? t("submissionDetails")
      : `${t("submission")} ${index + 1}`;

  return (
    <AccordionItem
      value={submission.id}
      className={`rounded-[18px] border bg-white px-3 ${statusClasses.panel}`}
    >
      <AccordionTrigger className="py-4 hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <h4 className="text-sm font-semibold text-[#3B5D2A]">{title}</h4>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses.badge}`}
          >
            {statusLabel}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-4">
        {isLoading ? (
          <div className="rounded-[16px] border border-[#E5E7EB] p-4 text-sm text-black/60">
            {t("loadingSubmissionDetails")}
          </div>
        ) : error ? (
          <div className="rounded-[16px] border border-red-200 bg-red-50 p-4 text-sm text-red-500">
            {error}
          </div>
        ) : item ? (
          <SubmissionDetailsPanel
            campaign={campaign}
            milestone={milestone}
            submission={submission}
            detail={item}
          />
        ) : (
          <div className="rounded-[16px] border border-[#E5E7EB] p-4 text-sm text-black/50">
            {t("noSubmissionDetailsFound")}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
