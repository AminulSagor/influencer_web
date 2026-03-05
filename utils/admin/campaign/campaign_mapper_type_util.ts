import type { Campaignservice } from "@/types/admin/campaign/campaign_api_type";
import { CampaignStatus, CampaignUI } from "@/types/admin/campaign/campaign_ui_type";

function safeDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "—";
  }
}

export function mapserviceCampaignToUI(item: Campaignservice): CampaignUI {
  return {
    id: item.id,
    name: item.campaignName || "Untitled Campaign",
    category: item.campaignType || "—",
    niches: item.campaignNiche || "—",
    client: item.client?.brandName || "Unknown",
    avatar: "",

    startDate: safeDate(item.timeline?.startingDate ?? null),
    endDate: safeDate(item.timeline?.endDate ?? null),

    budget: item.financials?.clientBudget ?? 0,
    quote: item.financials?.finalQuoteAmount ?? 0,

    // ✅ raw backend status
    status: item.status as CampaignStatus,

    assignedPersonals: {
      count: item.assignedPersonals?.count ?? 0,
      influencers: item.assignedPersonals?.influencers ?? [],
    },
  };
}
