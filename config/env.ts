// src/config/env.ts
export const service_URL = process.env.NEXT_PUBLIC_SERVICE_URL || "";

if (!service_URL) {
  // keep it non-crashing in prod builds; but warn in dev
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.warn("NEXT_PUBLIC_SERVICE_URL is missing");
  }
}
