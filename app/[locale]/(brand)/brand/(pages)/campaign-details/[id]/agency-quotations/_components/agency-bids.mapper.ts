import {
  CampaignBid,
  RawCampaignBid,
} from "@/types/client/campaigns/campaign-bids.types";

const toNumber = (value?: string | number | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function mapRawCampaignBidToCampaignBid(
  input: RawCampaignBid,
  baseBudget: number,
): CampaignBid {
  const agencyId = input.agencyId ?? input.agency?.id ?? "";
  const agencyFeePercent = toNumber(input.agencyFeePercent);
  const agencyFeeAmount =
    toNumber(input.agencyFeeAmount) || (baseBudget * agencyFeePercent) / 100;
  const budgetExcludingAgencyFee =
    toNumber(input.budgetExcludingAgencyFee) || baseBudget;
  const dollarRate = toNumber(input.dollarRate) || 122.37;
  const inDollar =
    toNumber(input.inDollar) ||
    (budgetExcludingAgencyFee > 0 && dollarRate > 0
      ? budgetExcludingAgencyFee / dollarRate
      : 0);

  const nicheLabels =
    input.nicheLabels?.filter(Boolean) ??
    input.agency?.niches?.map((item) => item.name ?? "").filter(Boolean) ??
    [];

  return {
    id: input.id ?? agencyId,
    agencyId,
    agency: {
      id: agencyId,
      agencyName: input.agency?.agencyName ?? input.agencyName ?? "Unnamed Agency",
      logo: input.agency?.logo ?? input.agencyLogo ?? null,
    },
    nicheLabels,
    agencyFeePercent,
    agencyFeeAmount,
    budgetExcludingAgencyFee,
    dollarRate,
    inDollar,
    createdAt: input.createdAt,
  };
}