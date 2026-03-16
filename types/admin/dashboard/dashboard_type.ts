export interface DashboardSummaryCardsData {
  totalRevenue: number;
  pendingPayouts: number;
  activeCampaigns: number;
  influencers: number;
  agencies: number;
  clients: number;
}

export interface DashboardSummaryCardsResponse {
  success: boolean;
  data: DashboardSummaryCardsData;
}