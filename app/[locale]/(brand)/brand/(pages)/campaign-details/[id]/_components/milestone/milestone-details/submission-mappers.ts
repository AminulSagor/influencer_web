import {
  CampaignAssignedInfluencer,
  ClientSubmissionDetailResponse,
  InfluencerPromotionSubmissionListItem,
  SubmissionDetail,
  SubmissionSummary,
} from "@/types/client/campaigns/campaign-submission.types";

type BuildInfluencerPromotionSubmissionParams = {
  campaignId: string;
  campaignName: string;
  milestoneId: string;
  assignedInfluencers?: CampaignAssignedInfluencer[];
};

export function mapClientSubmissionDetailToSubmissionDetail(
  input: ClientSubmissionDetailResponse,
): SubmissionDetail {
  return {
    id: input.id,
    submissionDescription: input.content?.description ?? null,
    submissionAttachments: input.content?.attachments ?? [],
    submissionLiveLinks: input.content?.liveLinks ?? [],
    requestedAmount: String(input.milestone?.amount ?? "0"),
    submittedByRole: "influencer",
    rejectionReason: null,
    isClientApproved: input.isApproved ?? false,
    achievedReach: 0,
    achievedViews: 0,
    achievedLikes: 0,
    achievedComments: 0,
    paidAmount: "0.00",
    paymentStatus: input.paymentStatus ?? "unpaid",
    adminFeedback: null,
    status: input.status,
    assignmentId: "",
    milestoneId: input.milestone?.id ?? "",
    assignedMilestoneId: "",
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
    milestoneTitle: input.milestone?.title ?? "",
  };
}

export function buildInfluencerPromotionSubmissionItems({
  campaignId,
  campaignName,
  milestoneId,
  assignedInfluencers = [],
}: BuildInfluencerPromotionSubmissionParams): InfluencerPromotionSubmissionListItem[] {
  const items: InfluencerPromotionSubmissionListItem[] = [];

  for (const influencer of assignedInfluencers) {
    for (const work of influencer.assignedWork ?? []) {
      if (
        work.masterMilestoneId !== milestoneId &&
        work.id !== milestoneId
      ) {
        continue;
      }

      for (const submission of work.submissions ?? []) {
        const summary: SubmissionSummary = {
          id: submission.id,
          campaignId,
          campaignName,
          influencerName: influencer.name ?? null,
          influencerImage: influencer.image ?? null,
          milestoneTitle: work.contentTitle ?? "",
          amount: Number(submission.requestedAmount ?? work.amount ?? 0),
          attachments: submission.submissionAttachments ?? [],
          liveLinks: submission.submissionLiveLinks ?? [],
          status: submission.status,
          isApproved: submission.isClientApproved ?? false,
          submittedAt: submission.createdAt,
        };

        const detail: SubmissionDetail = {
          ...submission,
          milestoneTitle: work.contentTitle ?? "",
        };

        items.push({ summary, detail });
      }
    }
  }

  items.sort(
    (a, b) =>
      new Date(b.detail.createdAt).getTime() -
      new Date(a.detail.createdAt).getTime(),
  );

  return items;
}