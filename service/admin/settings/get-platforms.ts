import { serviceServer } from "@/service/base/axios_server";

export type PlatformItem = {
  id: string;
  name: string;
};

const normalizePlatforms = (data: unknown): PlatformItem[] => {
  const items = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown })?.data)
    ? (data as { data: unknown[] }).data
    : [];

  const seen = new Set<string>();

  return items
    .map((item) => {
      const value = item as Partial<PlatformItem>;
      return {
        id: String(value.id ?? value.name ?? ""),
        name: String(value.name ?? "").trim(),
      };
    })
    .filter((item) => {
      const key = item.name.toLowerCase();
      if (!item.name || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export const getPlatforms = async (): Promise<PlatformItem[]> => {
  const res = await serviceServer.get("/campaign/get/platforms");

  return normalizePlatforms(res.data);
};
