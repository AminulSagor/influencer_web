"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MilestoneService } from "@/service/influencer/milestone-service";
import type { WithdrawableBalanceData } from "@/types/influencer/milestone_types";

interface CampaignEarningsCardProps {
  campaignId: string;
}

const formatCurrency = (value?: number | string | null) => {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

const CampaignEarningsCard = ({ campaignId }: CampaignEarningsCardProps) => {
  const [balance, setBalance] = useState<WithdrawableBalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!campaignId) return;

    try {
      setLoading(true);
      const res = await MilestoneService.getWithdrawableBalance(campaignId);
      setBalance(res.data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load campaign earnings"
      );
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const totalApproved = Number(balance?.financials?.totalApproved ?? 0);
  const availableToWithdraw = Number(
    balance?.financials?.availableToWithdraw ?? 0
  );
  const canWithdraw = availableToWithdraw > 0 && !requesting;

  const handleWithdrawalRequest = async () => {
    if (!canWithdraw) return;

    try {
      setRequesting(true);
      await MilestoneService.requestWithdrawal({
        campaignId,
        amount: availableToWithdraw,
      });
      toast.success("Withdrawal request submitted successfully.");
      await fetchBalance();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit withdrawal request"
      );
    } finally {
      setRequesting(false);
    }
  };

  return (
    <Card className="h-full shadow-md">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-Primary">Campaign Earnings</CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col justify-center p-4 pt-2">
        {loading ? (
          <div className="rounded-lg border border-light-green bg-linear-to-r from-Secondary to-white p-5">
            <Skeleton className="mb-4 h-4 w-2/3" />
            <Skeleton className="mb-6 h-8 w-1/3" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : (
          <div className="rounded-lg border border-light-green bg-linear-to-r from-Secondary to-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4">
                <p className="text-sm font-medium">Total Campaign Earnings</p>
                <p className="text-3xl font-bold text-Primary">
                  ৳ {formatCurrency(totalApproved)}
                </p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-light-green text-2xl font-black text-light-green">
                ৳
              </div>
            </div>

            <Button
              type="button"
              disabled={!canWithdraw}
              onClick={handleWithdrawalRequest}
              className="mt-8 w-full border border-light-green bg-white/70 text-light-green hover:bg-light-green hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {requesting ? "Requesting..." : "Withdrawal Request"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignEarningsCard;
