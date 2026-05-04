import {
  CampaignStatus,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";

type QuoteCampaign = ClientCampaignDetails & {
  id: string;
  campaignName?: string | null;
  campaignType?: "influencer_promotion" | "paid_ad" | string;
  status: CampaignStatus;
  baseBudget?: number | string | null;
  vatAmount?: number | string | null;
  totalBudget?: number | string | null;
  paidAmount?: number | string | null;
  dueAmount?: number | string | null;
  assignedAt?: string | null;
  paymentStatus?: "pending" | "partial" | "paid" | string | null;
  paymentInfo?: {
    totalAmount?: number | string | null;
    paidAmount?: number | string | null;
    dueAmount?: number | string | null;
  } | null;
  assignedInfluencers?: unknown[];
  clientProposedServiceFee?: string | null;
  serviceFee?: string | number | null;
  averageDollarRate?: string | number | null;
  dollarRate?: string | number | null;
  vatRate?: string | number | null;
};

export type QuoteDetailsCampaign = QuoteCampaign;

export const quoteActionStatuses: CampaignStatus[] = [
  "received",
  "negotiating",
  "quoted",
  "pending_agency",
  "agency_negotiating",
  "pending_influencer",
  "budget_quoting",
  "budget_building",
];

export const toNumber = (value?: string | number | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatBDT = (value: number) => {
  return `৳${value.toLocaleString("en-US")}`;
};

export const clampAmount = (value: number, max: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), Math.max(max, 0));
};

export const parseNumericInput = (raw: string) => {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};

export const getVatRate = (campaign: QuoteDetailsCampaign) => {
  const value = toNumber(campaign.vatRate);
  return value > 0 ? value : 15;
};

export const getServiceFeeRange = (campaign: QuoteDetailsCampaign) => {
  if (typeof campaign.clientProposedServiceFee === "string") {
    return campaign.clientProposedServiceFee;
  }

  if (typeof campaign.serviceFee === "string") {
    return campaign.serviceFee;
  }

  if (typeof campaign.serviceFee === "number") {
    return `${campaign.serviceFee}%`;
  }

  return "5-15%";
};

export const getDollarRate = (campaign: QuoteDetailsCampaign) => {
  const avgRate = toNumber(campaign.averageDollarRate);
  if (avgRate > 0) return avgRate;

  const dollarRate = toNumber(campaign.dollarRate);
  if (dollarRate > 0) return dollarRate;

  return 122.37;
};

export const parsePercentRange = (raw: string) => {
  const matches = raw.match(/\d+(\.\d+)?/g) ?? [];
  const values = matches.map(Number).filter((value) => Number.isFinite(value));

  if (!values.length) {
    return { min: 0, max: 0 };
  }

  if (values.length === 1) {
    return { min: values[0], max: values[0] };
  }

  return {
    min: Math.min(values[0], values[1]),
    max: Math.max(values[0], values[1]),
  };
};

export const formatRangeBDT = (min: number, max: number) => {
  if (Math.round(min) === Math.round(max)) {
    return formatBDT(Math.round(min));
  }

  return `${formatBDT(Math.round(min))} - ${formatBDT(Math.round(max))}`;
};

export const formatRangeDollar = (min: number, max: number) => {
  const formattedMin = `$${min.toFixed(2)}`;
  const formattedMax = `$${max.toFixed(2)}`;

  if (formattedMin === formattedMax) {
    return formattedMin;
  }

  return `${formattedMin} - ${formattedMax}`;
};

export const buildPaidAdPreview = (
  proposedBaseBudget: number,
  feeRangeText: string,
  dollarRate: number,
  vatRate: number,
) => {
  const vatAmount = Math.round((proposedBaseBudget * vatRate) / 100);
  const totalCampaignCost = proposedBaseBudget + vatAmount;

  const { min, max } = parsePercentRange(feeRangeText);

  const agencyFeeMin = (proposedBaseBudget * min) / 100;
  const agencyFeeMax = (proposedBaseBudget * max) / 100;

  const excludingAgencyFeeMin = proposedBaseBudget - agencyFeeMin;
  const excludingAgencyFeeMax = proposedBaseBudget - agencyFeeMax;

  const dollarsMin = excludingAgencyFeeMin / dollarRate;
  const dollarsMax = excludingAgencyFeeMax / dollarRate;

  return {
    vatAmount,
    totalCampaignCost,
    agencyFeeMin,
    agencyFeeMax,
    excludingAgencyFeeMin: Math.min(
      excludingAgencyFeeMin,
      excludingAgencyFeeMax,
    ),
    excludingAgencyFeeMax: Math.max(
      excludingAgencyFeeMin,
      excludingAgencyFeeMax,
    ),
    dollarsMin: Math.min(dollarsMin, dollarsMax),
    dollarsMax: Math.max(dollarsMin, dollarsMax),
  };
};

export const getQuoteSummary = (campaign: QuoteDetailsCampaign) => {
  const baseBudget = toNumber(campaign.baseBudget);
  const vatAmount = toNumber(campaign.vatAmount);
  const totalCost = toNumber(
    campaign.paymentInfo?.totalAmount ?? campaign.totalBudget,
  );
  const paidAmount = toNumber(
    campaign.paymentInfo?.paidAmount ?? campaign.paidAmount,
  );
  const dueAmount = toNumber(
    campaign.paymentInfo?.dueAmount ?? campaign.dueAmount,
  );

  const isInfluencerPromotion =
    campaign.campaignType === "influencer_promotion";

  const normalizedStatus = campaign.status?.toLowerCase();
  const normalizedPaymentStatus = campaign.paymentStatus?.toLowerCase();

  const isReceived = normalizedStatus === "received";
  const isNegotiating = normalizedStatus === "negotiating";
  const isAgencyNegotiating = normalizedStatus === "agency_negotiating";

  const isPendingPayment = normalizedPaymentStatus === "pending";
  const isPartialPayment = normalizedPaymentStatus === "partial";
  const isPaid =
    normalizedPaymentStatus === "paid" ||
    (totalCost > 0 && dueAmount <= 0 && paidAmount >= totalCost);

  const showQuoteActions = isNegotiating;

  const canPay =
    !isNegotiating &&
    !isAgencyNegotiating &&
    !isReceived &&
    !isPaid &&
    dueAmount > 0 &&
    (isPendingPayment || isPartialPayment || paidAmount > 0);

  const showConfirmedState =
    isAgencyNegotiating || (!isNegotiating && !isReceived && !isPaid && dueAmount <= 0);

  return {
    baseBudget,
    vatAmount,
    totalCost,
    paidAmount,
    dueAmount,
    isInfluencerPromotion,
    showQuoteActions,
    isPendingPayment,
    isPartialPayment,
    isPaid,
    canPay,
    showConfirmedState,
  };
};
