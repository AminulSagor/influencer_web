export type BudgetingFilter = "all" | "budget_pending" | "quotation_received";

export const BUDGETING_STATUS_QUERY: Record<BudgetingFilter, string> = {
  all: "quoting",
  budget_pending: "budget_pending",
  quotation_received: "quotation_received",
};

export const BUDGETING_FILTER_ITEMS: Array<{
  key: BudgetingFilter;
  label: string;
}> = [
  { key: "all", label: "All" },
  { key: "budget_pending", label: "Budget Pending" },
  { key: "quotation_received", label: "Quotation Received" },
];