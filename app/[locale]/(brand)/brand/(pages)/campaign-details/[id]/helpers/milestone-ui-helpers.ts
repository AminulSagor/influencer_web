export const statusStyle = (status?: string) => {
  const s = String(status ?? "").toLowerCase();

  if (s === "completed") {
    return {
      card: "border-light-green bg-light-green/10",
      badge: "bg-light-green/20 text-light-green border-light-green/30",
      text: "text-light-green",
      pill: "Completed",
    };
  }

  if (s === "paid" || s === "partial_paid") {
    return {
      card: "border-emerald-400/40 bg-emerald-50",
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
      text: "text-emerald-700",
      pill: s === "paid" ? "Paid" : "Partial Paid",
    };
  }

  if (s === "approved") {
    return {
      card: "border-blue-400/40 bg-blue-50",
      badge: "bg-blue-100 text-blue-700 border-blue-200",
      text: "text-blue-700",
      pill: "Approved",
    };
  }

  if (s === "in_review") {
    return {
      card: "border-orange-400/50 bg-orange-50",
      badge: "bg-orange-100 text-orange-700 border-orange-200",
      text: "text-orange-700",
      pill: "In Review",
    };
  }

  if (s === "declined") {
    return {
      card: "border-red-400/50 bg-red-50",
      badge: "bg-red-100 text-red-700 border-red-200",
      text: "text-red-700",
      pill: "Declined",
    };
  }

  if (s === "todo") {
    return {
      card: "border-Primary/20 bg-Primary/5",
      badge: "bg-Primary/10 text-Primary border-Primary/20",
      text: "text-Primary",
      pill: "Todo",
    };
  }

  // pending (default)
  return {
    card: "border-black/10 bg-[#F7F7F7]",
    badge: "bg-white text-black/60 border-black/10",
    text: "text-black/60",
    pill: "Pending",
  };
};

export const isMilestoneExpandable = (status?: string) => {
  const s = String(status ?? "").toLowerCase();
  // Your rule: don't open details if milestone still pending
  return s !== "pending";
};
