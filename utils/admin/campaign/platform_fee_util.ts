// utils/admin/campaign/platform-fee.ts

export function clampPercent(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

export function calcPlatformFee(finalQuotedBudget: number, platformFeePercent: number) {
  const budget = Number(finalQuotedBudget || 0);
  const pct = clampPercent(platformFeePercent);

  const platformFeeAmount = Math.round((budget * pct) / 100);
  const availableBudget = Math.max(0, budget - platformFeeAmount);

  return { platformFeePercent: pct, platformFeeAmount, availableBudget };
}