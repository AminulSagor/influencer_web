export function formatCurrencyBDT(amount: string | number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function formatReportDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function getRelativeTimeLabel(date: string, locale: string) {
  const now = new Date();
  const target = new Date(date);
  const diffMs = target.getTime() - now.getTime();

  const minutes = Math.round(diffMs / (1000 * 60));
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat(
    locale === "bn" ? "bn" : "en",
    { numeric: "auto" }
  );

  if (Math.abs(days) >= 1) return rtf.format(days, "day");
  if (Math.abs(hours) >= 1) return rtf.format(hours, "hour");
  return rtf.format(minutes, "minute");
}

export function normalizeReportStatus(status: string): "pending" | "resolved" {
  return status.toLowerCase() === "resolved" ? "resolved" : "pending";
}