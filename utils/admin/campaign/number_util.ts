export function safeStr(v: any) {
  return String(v ?? "").trim();
}

export function toNum(v: any) {
  const n = Number(String(v ?? "0").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}