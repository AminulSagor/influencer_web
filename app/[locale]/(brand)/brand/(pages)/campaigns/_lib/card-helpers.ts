export const formatBDT = (amount: number) =>
  `৳${amount.toLocaleString("en-US")}`;

export function toNumberSafe(v: string | null | undefined) {
  const n = Number(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatDateLabel(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export const getAssignedUserBasedText = (
  isAssigned: boolean,
  campaignType: "influencer_promotion" | "paid_ad"
) => {
  const isPaid = campaignType === "paid_ad";
  const isInfluencerPromotion = campaignType === "influencer_promotion";

  if (isPaid) {
    return !isAssigned && "No agency assigned";
  }
  if (isInfluencerPromotion) {
    return !isAssigned && "No influencer assigned";
  }
  return "";
};
