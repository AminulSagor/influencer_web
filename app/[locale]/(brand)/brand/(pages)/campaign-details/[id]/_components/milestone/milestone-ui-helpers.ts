export const normalizeMilestoneStatus = (status?: string) =>
  String(status ?? "")
    .trim()
    .toLowerCase();

export const getMilestoneStatusLabel = (status?: string) => {
  const value = normalizeMilestoneStatus(status);

  if (value === "completed") return "Completed";
  if (value === "accepted") return "Completed++";
  // FIX: Add "in_progress" to show "In Review"
  if (value === "in_review" || value === "in_progress") return "In Review";
  if (value === "declined") return "Declined";
  if (value === "pending") return "Pending";

  if (!value) return "Pending";

  return value
    .split("_")
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};

export const getMilestoneStatusClasses = (status?: string) => {
  const value = normalizeMilestoneStatus(status);

  if (value === "completed" || value === "accepted") {
    return {
      wrapper: "border-[#A8C381] bg-[#F9FBEF]",
      badge: "bg-[#7EA255] text-white",
      text: "text-[#7EA255]",
      soft: "text-[#7EA255]",
    };
  }

  // FIX: Add "in_progress" to use same styling as "in_review"
  if (value === "in_review" || value === "in_progress") {
    return {
      wrapper: "border-[#F2C38B] bg-[#FFFDF9]",
      badge: "bg-[#D68426] text-white",
      text: "text-[#D68426]",
      soft: "text-[#D68426]",
    };
  }

  if (value === "declined") {
    return {
      wrapper: "border-[#FF5A5A] bg-[#FFF8F8]",
      badge: "bg-[#FF1616] text-white",
      text: "text-[#FF1616]",
      soft: "text-[#FF1616]",
    };
  }

  if (value === "pending") {
    return {
      wrapper: "border-[#D9D9D9] bg-white",
      badge: "bg-[#8F8F8F] text-white",
      text: "text-[#8F8F8F]",
      soft: "text-[#8F8F8F]",
    };
  }

  return {
    wrapper: "border-[#D9D9D9] bg-white",
    badge: "bg-[#8F8F8F] text-white",
    text: "text-[#8F8F8F]",
    soft: "text-[#8F8F8F]",
  };
};

export const formatMilestoneDate = (value?: string) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const formatCompactNumber = (value?: number | null) => {
  if (value == null || !Number.isFinite(value)) return "—";

  if (value >= 1_000_000) {
    const v = value / 1_000_000;
    return `${Number.isInteger(v) ? v : v.toFixed(1)}M`;
  }

  if (value >= 1_000) {
    const v = value / 1_000;
    return `${Number.isInteger(v) ? v : v.toFixed(0)}K`;
  }

  return `${value}`;
};
