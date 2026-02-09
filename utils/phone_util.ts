export function handlePhoneFormat(phone: string) {
  const p = phone.trim();
  if (p.startsWith("+880")) return p;
  if (p.startsWith("880")) return `+${p}`;
  if (p.startsWith("01")) return `+88${p}`;
  return p; // fallback
}
