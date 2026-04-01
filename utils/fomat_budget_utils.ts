export const formatBudget = (amount?: number | null) => {
  if (!amount || amount <= 0) return "None";
  return `৳${amount.toLocaleString("en-BD")}`;
};
