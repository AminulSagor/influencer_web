export function extractUrlHandle(url?: string) {
  if (!url) return "";

  try {
    const full = url.startsWith("http") ? url : `https://${url}`;
    const u = new URL(full);
    return u.pathname.replace(/^\/+/, "");
  } catch {
    return url.replace(/^https?:\/\/(www\.)?[^/]+\//, "");
  }
}