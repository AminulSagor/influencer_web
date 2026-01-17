import type { CampaignSummary } from "@/app/[locale]/(brand)/brand/types/client-types";

export function filterBySearch(items: CampaignSummary[], q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return items;

  return items.filter((c) => {
    const name = (c.campaignName ?? "").toLowerCase();
    // const clientName = (c.client?.name ?? "").toLowerCase();
    // return name.includes(query) || clientName.includes(query);
    return name.includes(query);
  });
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (safePage - 1) * perPage;
  const paged = items.slice(startIndex, startIndex + perPage);

  const start = total === 0 ? 0 : startIndex + 1;
  const end = Math.min(startIndex + perPage, total);

  return { paged, total, totalPages, page: safePage, start, end };
}
