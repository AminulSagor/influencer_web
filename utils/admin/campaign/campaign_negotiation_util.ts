import type {
  CampaignNegotiationItem,
  CampaignNegotiationMeta,
} from "@/service/admin/campaign/get-campaign-negotiations";

type QuoteState = "none" | "sent" | "confirmed";

type FinancialFallback = {
  clientBudget: number;
  vatAmount: number;
  totalBudget: number;
  netPayableAmount: number;
  platformFeePercent: number;
  platformFeeAmount: number;
  availableForInfluencers: number;
  availableForAgency: number;
};

const toNumber = (value: unknown) => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

export function getLatestNegotiation(
  negotiations: CampaignNegotiationItem[] = []
): CampaignNegotiationItem | null {
  if (!Array.isArray(negotiations) || negotiations.length === 0) return null;

  return [...negotiations].sort((a, b) => {
    const aTime = new Date(a?.createdAt ?? 0).getTime();
    const bTime = new Date(b?.createdAt ?? 0).getTime();
    return bTime - aTime;
  })[0];
}

export function getNegotiationFinancials(
  negotiations: CampaignNegotiationItem[] = [],
  fallback: FinancialFallback
) {
  const latest = getLatestNegotiation(negotiations);

  if (!latest) return fallback;

  const latestBaseBudget = toNumber(latest?.proposedBaseBudget);
  const latestTotalBudget = toNumber(latest?.proposedTotalBudget);

  const clientBudget = latestBaseBudget || fallback.clientBudget;
  const totalBudget = latestTotalBudget || fallback.totalBudget;
  const vatAmount = Math.max(0, totalBudget - clientBudget);

  const platformFeePercent = fallback.platformFeePercent ?? 2;
  const platformFeeAmount = Math.round((totalBudget * platformFeePercent) / 100);

  return {
    clientBudget,
    vatAmount,
    totalBudget,

    // important:
    // Quote Amount input should initially use the base amount, not total
    netPayableAmount: clientBudget,

    platformFeePercent,
    platformFeeAmount,
    availableForInfluencers: Math.max(0, totalBudget - platformFeeAmount),
    availableForAgency: Math.max(0, totalBudget - platformFeeAmount),
  };
}

export function getNegotiationAwareQuoteState(args: {
  fallbackQuoteState: QuoteState;
  campaignMeta?: CampaignNegotiationMeta | null;
  negotiations?: CampaignNegotiationItem[];
}): QuoteState {
  const { fallbackQuoteState, campaignMeta, negotiations = [] } = args;

  if (fallbackQuoteState === "confirmed") return "confirmed";

  const latest = getLatestNegotiation(negotiations);
  if (!latest) return fallbackQuoteState;

  const negotiationTurn = String(campaignMeta?.negotiationTurn ?? "").toLowerCase();
  const yourTurn = Boolean(campaignMeta?.yourTurn);

  // client re-quoted and now admin must respond
  if (negotiationTurn === "admin" && yourTurn) {
    return "none";
  }

  // admin already sent latest quote, waiting on client
  if (latest.sender === "admin") {
    return "sent";
  }

  return fallbackQuoteState;
}

export function getNegotiationRevisedCount(
  negotiations: CampaignNegotiationItem[] = []
) {
  if (!Array.isArray(negotiations) || negotiations.length === 0) return 0;

  return negotiations.filter((item) => {
    const sender = String(item?.sender ?? "").toLowerCase();
    const action = String(item?.action ?? "").toLowerCase();

    return sender === "client" || action === "counter_offer";
  }).length;
}