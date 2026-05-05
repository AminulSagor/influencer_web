import {
  CampaignBid,
  RawCampaignBid,
} from "@/types/client/campaigns/campaign-bids.types";

const toNumber = (value?: string | number | null) => {
  if (typeof value === "string") {
    const cleaned = value.replace("%", "").trim();
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function mapRawCampaignBidToCampaignBid(
  input: RawCampaignBid,
  baseBudget: number,
): CampaignBid {
  const agencyId = input.agencyId ?? input.agency?.id ?? "";

  const agencyFeePercent = toNumber(
    input.agencyFeePercent ?? input.appliedFeePercent ?? input.proposedServiceFeePercent,
  );

  const agencyFeeAmount =
    toNumber(input.agencyFeeAmount ?? input.agencyServiceFeeAmount) ||
    (baseBudget * agencyFeePercent) / 100;

  const budgetExcludingAgencyFee =
    toNumber(
      input.budgetExcludingAgencyFee ?? input.totalpayableExcludingAgencyServiceFee,
    ) || baseBudget;

  const dollarRate = toNumber(input.dollarRate) || 122.37;

  const inDollar =
    toNumber(input.inDollar ?? input.totalCampaignSpentInDollar) ||
    (budgetExcludingAgencyFee > 0 && dollarRate > 0
      ? budgetExcludingAgencyFee / dollarRate
      : 0);

  const nicheLabels =
    input.nicheLabels?.filter(Boolean) ??
    input.niche?.map((item) => item.niche ?? "").filter(Boolean) ??
    input.agency?.niches?.map((item) => item.name ?? "").filter(Boolean) ??
    [];

  return {
    id: input.id ?? agencyId,
    agencyId,
    agency: {
      id: agencyId,
      agencyName:
        input.agency?.agencyName ?? input.agencyName ?? "Unnamed Agency",
      logo: input.agency?.logo ?? input.logo ?? input.agencyLogo ?? null,
    },
    nicheLabels,
    agencyFeePercent,
    agencyFeeAmount,
    budgetExcludingAgencyFee,
    dollarRate,
    inDollar,
    createdAt: input.createdAt ?? input.submittedAt,
    email: input.email ?? input.agency?.email ?? undefined,
    phone: input.phone ?? input.agency?.phone ?? undefined,
  };
}