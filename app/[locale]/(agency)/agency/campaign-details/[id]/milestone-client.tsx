"use client";

import PaymentMilestone from "../_components/payment-milestone-card";
import {
  COMPLETED,
  COMPLETED_PLUS_PLUS,
  IN_REVIEW,
  PAID,
  PARTIAL_PAID,
  PaymanetMilestoneDataType,
  TODO,
} from "./consts";
import MileStoneCard from "../_components/milestone-card";
import { useCallback, useEffect, useState } from "react";
import type {
  AgencyMilestoneDetails,
  MilestoneTargetTitle,
} from "@/types/agency/campaign/milestone-submission.types";

interface Props {
  isAccepted: boolean;
  milestones: PaymanetMilestoneDataType[];
  paid: number;
  total: number;
}

const COMPLETED_MILESTONE_STATUSES = [
  "complete",
  "completed",
  "completed_plus_plus",
  "approved",
  "accepted",
];

const formatCompactNumber = (value: number | null | undefined) => {
  if (!value) return "N/A";

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }

  return String(value);
};

const getPositiveMetricValue = (value: number | null | undefined) => {
  const numericValue = Number(value ?? 0);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
};

const getPromotionTargetConfig = (
  milestone: AgencyMilestoneDetails
): { title: MilestoneTargetTitle | null; value: number | null } => {
  const reach = getPositiveMetricValue(milestone.expectedReach);
  if (reach !== null) return { title: "Reach", value: reach };

  const views = getPositiveMetricValue(milestone.expectedViews);
  if (views !== null) return { title: "Views", value: views };

  const likes = getPositiveMetricValue(milestone.expectedLikes);
  if (likes !== null) return { title: "Likes", value: likes };

  const comments = getPositiveMetricValue(milestone.expectedComments);
  if (comments !== null) return { title: "Comments", value: comments };

  const follows = getPositiveMetricValue(milestone.expectedFollows);
  if (follows !== null) return { title: "Follows", value: follows };

  return { title: null, value: null };
};

const mapMilestoneStatus = (milestone: AgencyMilestoneDetails) => {
  const normalized = String(milestone.status ?? "").trim().toLowerCase();
  const isCompletedStatus = COMPLETED_MILESTONE_STATUSES.includes(normalized);

  if (milestone.isMetrixOverflowed && isCompletedStatus) {
    return COMPLETED_PLUS_PLUS;
  }

  if (normalized === "completed_plus_plus") return COMPLETED_PLUS_PLUS;
  if (isCompletedStatus) return COMPLETED;
  if (normalized === "paid") return PAID;
  if (normalized === "partial_paid" || normalized === "partial-paid") {
    return PARTIAL_PAID;
  }
  if (normalized === "in_review" || normalized === "in-review") {
    return IN_REVIEW;
  }
  if (["declined", "decline", "rejected"].includes(normalized)) {
    return "Declined";
  }

  return TODO;
};

const MilestoneClient = ({ isAccepted, milestones, paid, total }: Props) => {
  const [localMilestones, setLocalMilestones] =
    useState<PaymanetMilestoneDataType[]>(milestones);
  const [selectedMilestone, setSelectedMilestone] =
    useState<PaymanetMilestoneDataType | null>(null);

  useEffect(() => {
    setLocalMilestones(milestones);
    setSelectedMilestone((previousMilestone) => {
      if (previousMilestone) {
        const matchingMilestone = milestones.find(
          (item) => item.milestoneId === previousMilestone.milestoneId
        );

        if (matchingMilestone) return matchingMilestone;
      }

      return milestones[0] ?? null;
    });
  }, [milestones]);

  const handleMilestoneDetailsLoaded = useCallback((details: AgencyMilestoneDetails) => {
    const targetConfig = getPromotionTargetConfig(details);
    const updates: Partial<PaymanetMilestoneDataType> = {
      title: details.contentTitle,
      contentRequirement: [details.contentQuantity],
      promotionTarget: formatCompactNumber(targetConfig.value),
      targetTitle: targetConfig.title,
      payout: Number(details.amount ?? 0),
      status: mapMilestoneStatus(details),
      isMetrixOverflowed: Boolean(details.isMetrixOverflowed),
      day: details.deliveryDays,
      promotionalGoal: details.promotionGoal ?? "N/A",
      submissions: details.submissions,
    };

    setLocalMilestones((previousMilestones) =>
      previousMilestones.map((item) =>
        item.milestoneId === details.id ? { ...item, ...updates } : item
      )
    );

    setSelectedMilestone((previousMilestone) =>
      previousMilestone?.milestoneId === details.id
        ? { ...previousMilestone, ...updates }
        : previousMilestone
    );
  }, []);

  return (
    <>
      <div>
        <PaymentMilestone
          paymentMilestoneData={localMilestones}
          paid={paid}
          total={total}
          selectedMilestone={selectedMilestone}
          onSelectMilestone={setSelectedMilestone}
        />
      </div>

      {selectedMilestone && (
        <div>
          <MileStoneCard
            milestone={selectedMilestone}
            canSubmit={isAccepted}
            onMilestoneDetailsLoaded={handleMilestoneDetailsLoaded}
          />
        </div>
      )}
    </>
  );
};

export default MilestoneClient;
