import { BadgeType } from "@/app/[locale]/(admin)/admin/(pages)/campaigns/campaign-details/_components/collapsible-card";
import { normalizeCampaignMilestoneStatus } from "./campaign-milestone/milestone_status_util";

export function getMilestoneCardStatusLabel(params: {
  milestoneStatus?: string | null;
  submissionStatus?: string | null;
  paymentStatus?: string | null;
}) {
  const milestoneStatus = normalizeCampaignMilestoneStatus(params.milestoneStatus);
  const submissionStatus = normalizeCampaignMilestoneStatus(params.submissionStatus);
  const paymentStatus = normalizeCampaignMilestoneStatus(params.paymentStatus);

  if (paymentStatus === "paid") return "Paid";
  if (paymentStatus === "partial_paid") return "Partial Paid";
  if (submissionStatus === "in_review") return "In Review";
  if (submissionStatus === "approved") return "Completed";
  if (submissionStatus === "declined") return "Declined";
  if (milestoneStatus === "todo") return "To Do";

  return "To Do";
}

export function getSubmissionBadge(
  submissionStatus?: string | null
): BadgeType | undefined {
  const status = normalizeCampaignMilestoneStatus(submissionStatus);

  if (status === "in_review") return "In Review";
  if (status === "approved") return "Completed";

  return undefined;
}