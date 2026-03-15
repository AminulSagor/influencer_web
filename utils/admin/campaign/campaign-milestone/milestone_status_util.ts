export type MilestoneDisplayStatus =
  | "todo"
  | "in_review"
  | "approved"
  | "declined"
  | "partial_paid"
  | "paid"
  | "unknown";

export function normalizeCampaignMilestoneStatus(
  value?: string | null
): MilestoneDisplayStatus {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (
    normalized === "todo" ||
    normalized === "in_review" ||
    normalized === "approved" ||
    normalized === "declined" ||
    normalized === "partial_paid" ||
    normalized === "paid"
  ) {
    return normalized;
  }

  return "unknown";
}

export function getMilestoneStatusLabel(value?: string | null) {
  const status = normalizeCampaignMilestoneStatus(value);

  switch (status) {
    case "todo":
      return "To Do";
    case "in_review":
      return "In Review";
    case "approved":
      return "Approved";
    case "declined":
      return "Declined";
    case "partial_paid":
      return "Partial Paid";
    case "paid":
      return "Paid";
    default:
      return "To Do";
  }
}

export function getMilestoneStatusUi(value?: string | null) {
  const status = normalizeCampaignMilestoneStatus(value);

  switch (status) {
    case "paid":
      return {
        label: "Paid",
        pillClass: "bg-[#7EA055] text-white",
        borderClass: "border-[#A9C27A]",
        bgClass: "bg-[#F8F8EF]",
        titleClass: "text-[#35571C]",
        amountClass: "text-[#587B3A]",
        numberClass: "bg-[#7EA055] text-white",
        ringClass: "ring-[#A9C27A]",
        statusBoxClass: "bg-[#7EA055]",
      };

    case "partial_paid":
      return {
        label: "Partial Paid",
        pillClass: "bg-[#7EA055] text-white",
        borderClass: "border-[#A9C27A]",
        bgClass: "bg-[#F8F8EF]",
        titleClass: "text-[#35571C]",
        amountClass: "text-[#587B3A]",
        numberClass: "bg-[#7EA055] text-white",
        ringClass: "ring-[#A9C27A]",
        statusBoxClass: "bg-[#7EA055]",
      };

    case "approved":
      return {
        label: "Approved",
        pillClass: "bg-[#7EA055] text-white",
        borderClass: "border-[#A9C27A]",
        bgClass: "bg-[#F8F8EF]",
        titleClass: "text-[#35571C]",
        amountClass: "text-[#587B3A]",
        numberClass: "bg-[#7EA055] text-white",
        ringClass: "ring-[#A9C27A]",
        statusBoxClass: "bg-[#7EA055]",
      };

    case "in_review":
      return {
        label: "In Review",
        pillClass: "bg-[#F3D9BE] text-[#D6852D]",
        borderClass: "border-[#F0BE7A]",
        bgClass: "bg-[#FFF9F2]",
        titleClass: "text-[#D6852D]",
        amountClass: "text-[#D6852D]",
        numberClass: "bg-[#D6852D] text-white",
        ringClass: "ring-[#F0BE7A]",
        statusBoxClass: "bg-[#D6852D]",
      };

    case "declined":
      return {
        label: "Declined",
        pillClass: "bg-[#FF1E1E] text-white",
        borderClass: "border-[#FF8F8F]",
        bgClass: "bg-[#FFF1F1]",
        titleClass: "text-[#FF1E1E]",
        amountClass: "text-[#35571C]",
        numberClass: "bg-[#FF1E1E] text-white",
        ringClass: "ring-[#FF8F8F]",
        statusBoxClass: "bg-[#FF1E1E]",
      };

    case "todo":
    default:
      return {
        label: "To Do",
        pillClass: "bg-[#9B9B9B] text-white",
        borderClass: "border-[#A9C27A]",
        bgClass: "bg-[#F8F8EF]",
        titleClass: "text-[#35571C]",
        amountClass: "text-[#587B3A]",
        numberClass: "bg-[#7EA055] text-white",
        ringClass: "ring-[#A9C27A]",
        statusBoxClass: "bg-[#9B9B9B]",
      };
  }
}

export function isMilestoneDoneForProgress(value?: string | null) {
  const status = normalizeCampaignMilestoneStatus(value);
  return (
    status === "approved" || status === "partial_paid" || status === "paid"
  );
}

export function getSubmissionAccordionBadge(
  submissionStatus?: string | null
): "Completed" | "In Review" | undefined {
  const normalized = String(submissionStatus ?? "").trim().toLowerCase();

  if (normalized === "approved") return "Completed";
  if (normalized === "in_review") return "In Review";

  return undefined;
}