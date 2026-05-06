import type { CampaignOverView } from "@/types/client/campaigns/campaign-overview";

export type CampaignSortValue = "ASC" | "DESC";

export function filterBySearch(
  campaigns: CampaignOverView[],
  query: string,
): CampaignOverView[] {
  const keyword = query.trim().toLowerCase();

  if (!keyword) return campaigns;

  return campaigns.filter((campaign) => {
    const campaignName = campaign.campaignName?.toLowerCase() ?? "";
    const campaignType = campaign.campaignType?.toLowerCase() ?? "";
    const status = campaign.status?.toLowerCase() ?? "";
    const assignedNames =
      campaign.assignedTo
        ?.map((member) => member.name?.toLowerCase() ?? "")
        .join(" ") ?? "";
    const platformNames =
      campaign.platforms?.map((platform) => platform.toLowerCase()).join(" ") ??
      "";

    return (
      campaignName.includes(keyword) ||
      campaignType.includes(keyword) ||
      status.includes(keyword) ||
      assignedNames.includes(keyword) ||
      platformNames.includes(keyword)
    );
  });
}

export function sortCampaigns(
  campaigns: CampaignOverView[],
  sortBy: CampaignSortValue,
): CampaignOverView[] {
  const list = [...campaigns];

  if (sortBy === "ASC") {
    return list.sort((a, b) => a.totalBudget - b.totalBudget);
  }

  return list.sort((a, b) => b.totalBudget - a.totalBudget);
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const startIndex = (safePage - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    paged: items.slice(startIndex, endIndex),
    total,
    page: safePage,
    perPage,
    totalPages,
    start: total === 0 ? 0 : startIndex + 1,
    end: Math.min(startIndex + perPage, total),
  };
}

export function buildCampaignDetailsHref(campaign: CampaignOverView): string {
  const baseHref = `/brand/campaign-details/${campaign.id}/details`;

  if (campaign.campaignType !== "paid_ad") {
    return baseHref;
  }

  const assignedAgency = campaign.assignedTo?.find(
    (member) => member?.name || member?.image,
  );

  if (!assignedAgency) {
    return baseHref;
  }

  const params = new URLSearchParams();

  if (assignedAgency.name) {
    params.set("agencyName", assignedAgency.name);
  }

  if (assignedAgency.image) {
    params.set("agencyImage", assignedAgency.image);
  }

  const query = params.toString();

  return query ? `${baseHref}?${query}` : baseHref;
}
