export function formatCurrencyBDT(amount: string | number | null | undefined) {
  const numericAmount = Number(amount ?? 0);

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

export function formatDateTimeLabel(date: string, locale: string) {
  const dateObj = new Date(date);

  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(dateObj);
}