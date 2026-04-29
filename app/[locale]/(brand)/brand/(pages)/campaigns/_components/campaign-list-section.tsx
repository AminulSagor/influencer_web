"use client";

import type { CampaignOverView } from "@/types/client/campaigns/campaign-overview";
import type { CampaignTabKey } from "../_lib/campaign-status";
import type { BudgetingFilter } from "../_lib/budgeting-status";

import CompletedCampaignsList from "../_components/lists/completed-campaigns-list";
import DraftCampaignsList from "../_components/lists/draft-campaigns-list";
import CancelledCampaignsList from "../_components/lists/cancelled-campaigns-list";
import ActiveCampaignsList from "../_components/lists/active-campaigns-list";
import BudgetingQuotingList from "../_components/lists/budgeting-quoting-list";

type Props = {
  tab: CampaignTabKey;
  campaigns: CampaignOverView[];
  loading: boolean;
  budgetingFilter: BudgetingFilter;
  onBudgetingFilterChange: (filter: BudgetingFilter) => void;
  onCampaignDeleted?: () => void;
};

export default function CampaignListSection({
  tab,
  campaigns,
  loading,
  budgetingFilter,
  onBudgetingFilterChange,
  onCampaignDeleted,
}: Props) {
  switch (tab) {
    case "active":
      return <ActiveCampaignsList campaigns={campaigns} loading={loading} />;

    case "budgeting_quoting":
      return (
        <BudgetingQuotingList
          campaigns={campaigns}
          loading={loading}
          filter={budgetingFilter}
          onFilterChange={onBudgetingFilterChange}
        />
      );

    case "completed":
      return <CompletedCampaignsList campaigns={campaigns} loading={loading} />;

    case "draft":
      return (
        <DraftCampaignsList
          campaigns={campaigns}
          loading={loading}
          onCampaignDeleted={onCampaignDeleted}
        />
      );

    case "cancelled":
      return <CancelledCampaignsList campaigns={campaigns} loading={loading} />;

    default:
      return null;
  }
}