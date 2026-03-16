import { Status } from "@/app/[locale]/(admin)/admin/(pages)/campaigns/campaign-details/_components/campaign-details-card";

export type CampaignStatusType =
  | "needs-quote"
  | "pending-invitations"
  | "active"
  | "completed"
  | "paid";

// ---------------- helpers ----------------
export function normalize(v: any) {
  return String(v ?? "").trim().toLowerCase();
}

/**
 * These statuses mean the quote is already accepted/confirmed enough
 * for budget distribution / profit section to unlock.
 *
 * IMPORTANT:
 * `pending_agency` is kept here so quoteState can still become "confirmed",
 * but for campaign progression we will separately map it to "pending-invitations".
 */
export const CONFIRMED_QUOTE_STATUSES = new Set([
  "pending_influencer",
  "pending_agency",
  "quote_accepted",
  "accepted",
  "confirmed",
  "approved",
  "client_accepted",
]);

export const SENT_QUOTE_STATUSES = new Set([
  "quote_sent",
  "sent",
  "waiting_client",
  "pending_client",
]);

export const ACTIVE_STATUSES = new Set(["active", "in_progress", "running"]);
export const COMPLETED_STATUSES = new Set(["completed", "done", "finished"]);
export const PAID_STATUSES = new Set(["paid", "payment_done"]);

export function mapStatusToUI(status: string | undefined): Status {
  const s = normalize(status);

  if (s === "received" || s === "needs_quote") return "Need Quote";

  if (SENT_QUOTE_STATUSES.has(s)) return "Need Quote";

  /**
   * paid ad / agency invite stage
   * should still visually behave like Pending Invitations
   */
  if (
    s === "pending" ||
    s === "pending_invitations" ||
    s === "pending-invitations" ||
    s === "pending_influencer" ||
    s === "pending_agency"
  ) {
    return "Pending Invitations";
  }

  if (CONFIRMED_QUOTE_STATUSES.has(s)) return "Need Quote";

  if (ACTIVE_STATUSES.has(s)) return "Active";
  if (COMPLETED_STATUSES.has(s)) return "Completed";
  if (PAID_STATUSES.has(s)) return "Paid";

  return "Need Quote";
}

export function mapCampaignStatus(status: string | undefined): CampaignStatusType {
  const s = normalize(status);

  if (s === "received" || s === "needs_quote") return "needs-quote";

  /**
   * FIX:
   * for paid ad / agency flow, pending_agency must still be invitation stage
   * otherwise invite-agency-bar never renders
   */
  if (
    s === "pending" ||
    s === "pending_invitations" ||
    s === "pending-invitations" ||
    s === "pending_influencer" ||
    s === "pending_agency"
  ) {
    return "pending-invitations";
  }

  if (CONFIRMED_QUOTE_STATUSES.has(s)) return "active";

  if (ACTIVE_STATUSES.has(s)) return "active";
  if (COMPLETED_STATUSES.has(s)) return "completed";
  if (PAID_STATUSES.has(s)) return "paid";

  return "needs-quote";
}

export function computeQuoteState(args: {
  campaign: any;
  rawStatus: string;
  rawQuoteStatus: string;
  waitingFor: string;
}): "none" | "sent" | "confirmed" {
  const { campaign, rawStatus, rawQuoteStatus, waitingFor } = args;

  if (
    CONFIRMED_QUOTE_STATUSES.has(rawStatus) ||
    CONFIRMED_QUOTE_STATUSES.has(rawQuoteStatus) ||
    campaign?.quote?.isAccepted === true ||
    campaign?.negotiation?.isAccepted === true
  ) {
    return "confirmed";
  }

  if (
    waitingFor === "client" ||
    SENT_QUOTE_STATUSES.has(rawStatus) ||
    SENT_QUOTE_STATUSES.has(rawQuoteStatus)
  ) {
    return "sent";
  }

  return "none";
}

export function getCampaignTypeFlags(campaign: any) {
  const campaignType = normalize(campaign?.campaignType);
  const isPaidAd = campaignType === "paid_ad";
  const isInfluencerCampaign = !isPaidAd;

  return { campaignType, isPaidAd, isInfluencerCampaign };
}

export function getPlatformListFromMilestones(milestones: any[]) {
  const keys = Array.from(
    new Set<string>(
      (milestones ?? [])
        .map((m: any) => m?.platform)
        .filter((p: any): p is string => typeof p === "string" && p.length > 0)
    )
  );

  return keys.map((key) => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    url:
      key === "instagram"
        ? "https://instagram.com"
        : key === "youtube"
          ? "https://youtube.com"
          : key === "tiktok"
            ? "https://tiktok.com"
            : key === "facebook"
              ? "https://facebook.com"
              : "#",
  }));
}

export function getInfluencerAvatars(preferredInfluencers: any[]) {
  return (preferredInfluencers ?? []).map((i: any, idx: number) => ({
    imageUrl: i?.profileImg ?? "/avatar-fallback.png",
    name:
      `${i?.firstName ?? ""} ${i?.lastName ?? ""}`.trim() ||
      `Influencer ${idx + 1}`,
  }));
}

export function getAssignedInfluencersForPayment(preferredInfluencers: any[]) {
  return (preferredInfluencers ?? []).map((i: any, idx: number) => {
    const fullName =
      (i?.name && String(i.name).trim()) ||
      `${i?.firstName ?? ""} ${i?.lastName ?? ""}`.trim();

    return {
      id: String(i?.id ?? i?._id ?? `inf-${idx + 1}`),
      name: fullName && fullName.length > 0 ? fullName : `Influencer ${idx + 1}`,
      avatarUrl: i?.profileImg ?? "/avatar-fallback.png",
      paymentMethods: Array.isArray(i?.paymentMethods) ? i.paymentMethods : [],
    };
  });
}

export function computeFinancials(campaign: any) {
  const totalBudget = Number(campaign?.totalBudget ?? 0);
  const clientBudget = Number(campaign?.baseBudget ?? 0);
  const vatAmount = Number(campaign?.vatAmount ?? 0);
  const netPayableAmount = Number(campaign?.totalBudget ?? 0);

  const platformFeePercent = 2;
  const platformFeeAmount = Math.round((totalBudget * platformFeePercent) / 100);

  const availableForInfluencers = Math.max(0, totalBudget - platformFeeAmount);
  const availableForAgency = Math.max(0, totalBudget - platformFeeAmount);

  return {
    totalBudget,
    clientBudget,
    vatAmount,
    netPayableAmount,
    platformFeePercent,
    platformFeeAmount,
    availableForInfluencers,
    availableForAgency,
  };
}