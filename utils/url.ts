const normalizeUrl = (raw: string) => (raw ?? "").trim();

export function isValidHttpUrl(value: string) {
  const v = normalizeUrl(value);
  if (!v) return true;

  try {
    const url = new URL(v);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
