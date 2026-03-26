import { CampaignUI } from "@/types/admin/campaign/campaign_ui_type";

export function exportCampaignsToCSV(campaigns: CampaignUI[]) {
  if (!campaigns || campaigns.length === 0) return;

  const headers = [
    "Campaign ID",
    "Campaign Name",
    "Category",
    "Client",
    "Budget",
    "Quote",
    "Start Date",
    "End Date",
    "Status",
    "Payment Status"
  ];

  const rows = campaigns.map((campaign) => [
    campaign.id ?? "—",
    `"${(campaign.name ?? "—").replace(/"/g, '""')}"`,
    `"${(campaign.category ?? "—").replace(/"/g, '""')}"`,
    `"${(campaign.client ?? "—").replace(/"/g, '""')}"`,
    campaign.budget ?? 0,
    campaign.quote ?? 0,
    campaign.startDate ?? "—",
    campaign.endDate ?? "—",
    campaign.status ?? "—",
    campaign.paymentStatus ?? "—"
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    headers.join(",") +
    "\n" +
    rows.map((row) => row.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `campaign_export_${new Date().toISOString().split("T")[0]}.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
