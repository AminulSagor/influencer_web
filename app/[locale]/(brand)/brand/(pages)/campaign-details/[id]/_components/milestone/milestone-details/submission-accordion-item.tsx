"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CampaignDetails,
  CampaignMilestone,
} from "@/types/client/campaigns/campaign-details";
import {
  SubmissionDetail,
  SubmissionSummary,
} from "@/types/client/campaigns/campaign-submission.types";
import {
  formatSubmissionStatusLabel,
  getSubmissionStatusClasses,
} from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-ui.helpers";
import { useSubmissionDetails } from "@/hooks/use-submission-details";
import SubmissionDetailsPanel from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-details-panel";

type Props = {
  submission: SubmissionSummary;
  index: number;
  campaign: CampaignDetails;
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
  const { item, isLoading, error } = useSubmissionDetails({
    submissionId: submission.id,
    enabled: isOpen,
    campaignType: campaign.campaignType,
    prefetchedDetail,
  });

  const statusClasses = getSubmissionStatusClasses(submission.status);
  const statusLabel = formatSubmissionStatusLabel(submission.status);

  return (
    <AccordionItem
      value={submission.id}
      className={`rounded-[18px] border bg-white px-3 ${statusClasses.panel}`}
    >
      <AccordionTrigger className="py-4 hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <h4 className="text-[18px] font-semibold text-[#3B5D2A]">
            Submission {index + 1}
          </h4>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-medium ${statusClasses.badge}`}
          >
            {statusLabel}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-4">
        {isLoading ? (
          <div className="rounded-[16px] border border-[#E5E7EB] p-4 text-sm text-muted-foreground">
            Loading submission details...
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
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}