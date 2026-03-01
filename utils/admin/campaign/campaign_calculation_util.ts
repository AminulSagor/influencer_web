export function safeNum(v: any) {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function money(n: number) {
  return safeNum(n).toLocaleString("en-US");
}

/**
 * Split total equally among "count".
 * We keep integers for BDT (no paisa).
 */
export function splitEqual(total: number, count: number) {
  const t = safeNum(total);
  const c = Math.max(0, Math.floor(safeNum(count)));

  if (c <= 0) {
    return { per: 0, remainder: t, count: 0 };
  }

  const per = Math.floor(t / c);
  const remainder = t - per * c;
  return { per, remainder, count: c };
}

export function amountToPercentage(amount: number, total: number) {
  const a = safeNum(amount);
  const t = safeNum(total);
  if (t <= 0) return 0;
  return round2((a / t) * 100);
}

export function percentageToAmount(percentage: number, total: number) {
  const p = safeNum(percentage);
  const t = safeNum(total);
  return Math.round((p / 100) * t);
}