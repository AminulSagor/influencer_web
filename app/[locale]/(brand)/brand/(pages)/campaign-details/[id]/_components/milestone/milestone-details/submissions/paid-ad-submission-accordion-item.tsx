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
import { SubmissionSummary } from "@/types/client/campaigns/campaign-submission.types";
import {
  formatSubmissionStatusLabel,
  getSubmissionStatusClasses,
} from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-ui.helpers";
import PaidAdSubmissionDetailsPanel from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/paid-ad-submission-details-panel";

type Props = {
  submission: SubmissionSummary;
  index: number;
  campaign: ClientCampaignDetails;
  milestone: CampaignMilestone;
};

export default function PaidAdSubmissionAccordionItem({
  submission,
  index,
  campaign,
  milestone,
}: Props) {
  const t = useTranslations("brand.CampaignDetailsPage");

  const statusClasses = getSubmissionStatusClasses(submission.status);
  const statusLabel = formatSubmissionStatusLabel(submission.status);

  return (
    <AccordionItem
      value={submission.id}
      className={`rounded-[18px] border bg-white px-3 ${statusClasses.panel}`}
    >
      <AccordionTrigger className="py-4 hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <h4 className="text-sm font-semibold text-[#3B5D2A]">
            {t("submission")} {index + 1}
          </h4>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses.badge}`}
          >
            {statusLabel}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-4">
        <PaidAdSubmissionDetailsPanel
          campaign={campaign}
          milestone={milestone}
          submission={submission}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
