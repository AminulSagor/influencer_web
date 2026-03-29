import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AgencyCampaignBudgetBreakdown } from "@/types/agency/job-details";

interface Props {
  budgetBreakdown: AgencyCampaignBudgetBreakdown;
}

const BDT_TO_USD_RATE = 122.37;

const formatCurrency = (value: string | number) => {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const formatUsd = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const QuoteDetailsCard = ({ budgetBreakdown }: Props) => {
  const netAvailable = Number(budgetBreakdown.netAvailableForAgency ?? 0);
  const usdAmount = netAvailable / BDT_TO_USD_RATE;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-Primary flex items-center gap-2">
          Quote Details
        </CardTitle>
        <div className="w-10 h-10 flex justify-center items-center rounded-full bg-Secondary">
          <span className="text-light-green font-semibold">৳</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="px-4 py-2 rounded-lg border border-light-green bg-linear-to-r bg-Secondary to-white">
          <div className="space-y-1 mb-1">
            <div className="flex items-center justify-between">
              <p className="text-sm">Base Campaign Budget</p>
              <p className="text-sm text-light-green">
                ৳{formatCurrency(budgetBreakdown.baseBudget)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">+ Vat/Tax(15%)</p>
              <p className="text-sm text-light-green">
                ৳{formatCurrency(budgetBreakdown.vat)}
              </p>
            </div>
          </div>

          <Separator className="bg-Primary/40" />

          <div className="flex items-center justify-between mb-2 mt-1">
            <p className="text-sm">Total Payable By Client</p>
            <p className="text-sm text-light-green">
              ৳{formatCurrency(budgetBreakdown.totalBudget)}
            </p>
          </div>

          <Separator className="bg-Primary/40" />

          <div className="flex items-center justify-between mb-2 mt-1">
            <p className="text-sm">Your Profit</p>
            <p className="text-sm text-light-green">
              ৳{formatCurrency(budgetBreakdown.estimatedAgencyProfit)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">-Platform Fee</p>
            <p className="text-sm text-light-green">
              -৳{formatCurrency(budgetBreakdown.adminPlatformFee)}
            </p>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm">Your Actual Profit</p>
            <p className="text-sm text-light-green">
              ৳{formatCurrency(budgetBreakdown.estimatedAgencyProfit)}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-lg border border-light-green bg-linear-to-r bg-Secondary to-white">
          <div className="space-y-1 mb-1">
            <div className="flex items-center justify-between">
              <p className="text-sm">Total Campaign Spent</p>
              <p className="text-sm text-light-green">
                ৳{formatCurrency(budgetBreakdown.netAvailableForAgency)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-Primary">
                Campaign Spent in Dollar ( {BDT_TO_USD_RATE} BDT/$ )
              </p>
              <p className="text-xs text-light-green font-semibold">
                ${formatUsd(usdAmount)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteDetailsCard;