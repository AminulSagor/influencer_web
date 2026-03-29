import { useEffect, useMemo, useState } from "react";
import { safeStr } from "@/utils/admin/campaign/number_util";
import { toNullableNumber, roundMoney } from "@/utils/admin/campaign/campaign-milestone/number_helpers";
import type { CampaignMilestoneservice } from "@/types/admin/campaign/campaign_details_type";

export function useInfluencerSelection(
  milestones: CampaignMilestoneservice[],
  isEditableAssignmentMode: boolean,
  assignmentRows: any[]
) {
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string>("");

  // Auto-select first influencer from assignment rows
  useEffect(() => {
    if (!isEditableAssignmentMode) return;
    setSelectedInfluencerId((prev) => {
      if (prev && assignmentRows.some((x: any) => safeStr(x?.assigneeId) === prev)) {
        return prev;
      }
      return safeStr(assignmentRows?.[0]?.assigneeId);
    });
  }, [assignmentRows, isEditableAssignmentMode]);

  const activeInfluencerOptions = useMemo(() => {
    if (isEditableAssignmentMode) {
      return assignmentRows.map((a: any) => ({
        id: safeStr(a?.assigneeId),
        name: safeStr(a?.assigneeName) || "Unknown Influencer",
        image: a?.assigneeImage ?? null,
        jobStatus: safeStr(a?.status),
      }));
    }

    const map = new Map<
      string,
      {
        id: string;
        name: string;
        image?: string | null;
        jobStatus?: string;
      }
    >();

    (milestones ?? []).forEach((m: any) => {
      const id = safeStr(m?.assignedToInfluencerId);
      if (!id) return;

      const prev = map.get(id);
      const nextJobStatus = safeStr(m?.jobStatus).toLowerCase();

      if (!prev) {
        map.set(id, {
          id,
          name: safeStr(m?.influencerName) || "Unknown Influencer",
          image: m?.influencerImage ?? null,
          jobStatus: nextJobStatus,
        });
        return;
      }

      if (prev.jobStatus !== "active" && nextJobStatus === "active") {
        map.set(id, {
          ...prev,
          jobStatus: nextJobStatus,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const aActive = a.jobStatus === "active" ? 0 : 1;
      const bActive = b.jobStatus === "active" ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return a.name.localeCompare(b.name);
    });
  }, [milestones, isEditableAssignmentMode, assignmentRows]);

  useEffect(() => {
    if (selectedInfluencerId) return;
    if (activeInfluencerOptions.length === 0) return;

    const activeOne =
      activeInfluencerOptions.find((x) => x.jobStatus === "active") ??
      activeInfluencerOptions[0];

    setSelectedInfluencerId(activeOne.id);
  }, [selectedInfluencerId, activeInfluencerOptions]);

  const selectedInfluencerLabel = useMemo(() => {
    if (!selectedInfluencerId) return "";
    return (
      activeInfluencerOptions.find((x) => x.id === selectedInfluencerId)?.name ??
      ""
    );
  }, [selectedInfluencerId, activeInfluencerOptions]);

  const selectedAssignment = useMemo(() => {
    if (!isEditableAssignmentMode) return null;
    return (
      assignmentRows.find(
        (x: any) => safeStr(x?.assigneeId) === safeStr(selectedInfluencerId)
      ) ?? null
    );
  }, [assignmentRows, selectedInfluencerId, isEditableAssignmentMode]);

  const assignmentBasedMilestones = useMemo(() => {
    if (!selectedAssignment) return [];

    return (selectedAssignment?.milestones ?? []).map((m: any, idx: number) => {
      const matchedCampaignMilestone =
        (milestones ?? []).find((cm) => {
          const sameMasterId =
            safeStr(cm?.id) &&
            safeStr(m?.masterMilestoneId) &&
            safeStr(cm?.id) === safeStr(m?.masterMilestoneId);

          const sameOwnId =
            safeStr(cm?.id) &&
            safeStr(m?.id) &&
            safeStr(cm?.id) === safeStr(m?.id);

          const sameOrderAndTitle =
            Number(cm?.order ?? -1) === Number(m?.order ?? -2) &&
            safeStr(cm?.contentTitle).toLowerCase() ===
              safeStr(m?.contentTitle || m?.title).toLowerCase();

          return sameMasterId || sameOwnId || sameOrderAndTitle;
        }) ?? null;

      return {
        id: safeStr(m?.id) || safeStr(m?.masterMilestoneId) || `m-${idx}`,
        masterMilestoneId:
          safeStr(m?.masterMilestoneId) || safeStr(matchedCampaignMilestone?.id),
        order: Number(m?.order ?? matchedCampaignMilestone?.order ?? idx),
        contentTitle: safeStr(
          m?.contentTitle ||
            m?.title ||
            matchedCampaignMilestone?.contentTitle
        ),
        title: safeStr(
          m?.contentTitle ||
            m?.title ||
            matchedCampaignMilestone?.contentTitle
        ),
        contentQuantity: safeStr(
          m?.contentQuantity || matchedCampaignMilestone?.contentQuantity
        ),
        platform: safeStr(m?.platform || matchedCampaignMilestone?.platform),
        amount: roundMoney(
          Number(m?.amount ?? matchedCampaignMilestone?.amount ?? 0)
        ),
        status: safeStr(m?.status),
        assignmentId: safeStr(selectedAssignment?.assigneeId),
        assignedToInfluencerId: safeStr(selectedAssignment?.assigneeId),
        influencerName: safeStr(selectedAssignment?.assigneeName),
        influencerImage: selectedAssignment?.assigneeImage ?? null,
        createdAt: m?.createdAt ?? selectedAssignment?.createdAt ?? null,
        updatedAt: m?.updatedAt ?? selectedAssignment?.updatedAt ?? null,
        jobStatus: safeStr(selectedAssignment?.status),
        promotionGoal:
          safeStr(m?.promotionGoal) ||
          safeStr(matchedCampaignMilestone?.promotionGoal) ||
          null,
        expectedReach: toNullableNumber(
          m?.expectedReach ?? matchedCampaignMilestone?.expectedReach
        ),
        expectedViews: toNullableNumber(
          m?.expectedViews ?? matchedCampaignMilestone?.expectedViews
        ),
        expectedLikes: toNullableNumber(
          m?.expectedLikes ?? matchedCampaignMilestone?.expectedLikes
        ),
        expectedComments: toNullableNumber(
          m?.expectedComments ?? matchedCampaignMilestone?.expectedComments
        ),
      };
    });
  }, [selectedAssignment, milestones]);

  return {
    selectedInfluencerId,
    setSelectedInfluencerId,
    activeInfluencerOptions,
    selectedInfluencerLabel,
    selectedAssignment,
    assignmentBasedMilestones,
  };
}
