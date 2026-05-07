"use client";

import { useMemo, useState } from "react";
import { Gift } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/components/spin-loader";

import { payoutBonus } from "@/service/admin/finance/payout-bonus";

import type {
  PendingBonusItem,
  PendingBonusesResponse,
  PayoutBonusTargetType,
} from "@/types/admin/finance/finance_bonus_clearance_type";

type Props = {
  data: PendingBonusesResponse;
  searchText?: string;
};

const formatCurrency = (amount?: number) => {
  if (amount == null) return "৳0";
  return `৳${new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

const formatDateTimeSmall = (date?: string) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

const resolveTargetType = (role?: string): PayoutBonusTargetType => {
  const normalizedRole = (role ?? "").toLowerCase();
  if (normalizedRole.includes("agency")) return "agency";
  return "influencer";
};

export default function BonusClearance({ data, searchText = "" }: Props) {
  const router = useRouter();

  const [selected, setSelected] = useState<PendingBonusItem | null>(null);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredData = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return data?.data ?? [];

    return (data?.data ?? []).filter((item) => {
      return (
        item.payeeInfo?.name?.toLowerCase().includes(q) ||
        item.campaign?.name?.toLowerCase().includes(q)
      );
    });
  }, [data?.data, searchText]);

  const handleOpenDialog = (item: PendingBonusItem) => {
    setSelected(item);
    setAmount(String(item.bonusAmount ?? 0));
    setOpen(true);
  };

  const handleCloseDialog = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      // Reset after close for better UX when reopening.
      setTimeout(() => {
        setSelected(null);
        setAmount("");
        setIsSubmitting(false);
      }, 150);
    }
  };

  const handleSubmit = async () => {
    if (!selected) return;

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid payout amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      await payoutBonus({
        campaignId: selected.campaign.id,
        targetType: resolveTargetType(selected.payeeInfo.role),
        targetId: selected.payeeInfo.id,
        amount: numericAmount,
      });

      toast.success("Bonus payout completed successfully.");
      handleCloseDialog(false);
      router.refresh();
    } catch (error: unknown) {
      const maybeAxiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const errorMessage =
        maybeAxiosError?.response?.data?.message ??
        maybeAxiosError?.message ??
        "Payout failed.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-[12px] border border-[#d9d9d9]">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[1.7fr_1.2fr_2fr_1.2fr_1.1fr_1fr] items-center bg-light-green px-2 py-3 text-sm font-medium text-white">
            <div>Payee Info</div>
            <div>Payment Type</div>
            <div>Campaign</div>
            <div>Amount</div>
            <div>Bonus</div>
            <div className="text-right pr-3">Action</div>
          </div>

          <div className="divide-y divide-[#e5e5e5]">
          {filteredData.map((item) => {
            const isOpen = selected?.campaign.id === item.campaign.id;

            return (
              <div
                key={`${item.campaign.id}-${item.payeeInfo.id}-${item.bonusRecordIds?.[0] ?? ""}`}
                className={[
                  "grid grid-cols-[1.7fr_1.2fr_2fr_1.2fr_1.1fr_1fr] items-center px-2 py-3 transition",
                  isOpen ? "bg-[#f5f6eb]" : "bg-white",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7 bg-[#a7d08c]">
                    <AvatarImage src={item.payeeInfo.image || "/"} />
                    <AvatarFallback className="bg-[#a7d08c] text-[11px] text-white">
                      {item.payeeInfo.name?.charAt(0) || "P"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-[#222]">
                      {item.payeeInfo.name}
                    </p>
                  </div>
                </div>

                <div className="text-[13px] text-[#222]">
                  {item.paymentType}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[#222]">
                    {item.campaign.name}
                  </p>
                  <p className="text-[10px] leading-4 text-[#a0a0a0]">
                    Last Updated:{" "}
                    {formatDateTimeSmall(
                      item.campaign.lastMilestoneUpdatedAt
                    )}
                  </p>
                </div>

                <div className="text-[15px] font-semibold text-light-green">
                  {formatCurrency(item.campaign.totalBudget)}
                </div>

                <div className="text-[15px] font-semibold text-orange">
                  {formatCurrency(item.bonusAmount)}
                </div>

                <div className="flex justify-end pr-2">
                  <Button
                    type="button"
                    variant="lightGreen"
                    onClick={() => handleOpenDialog(item)}
                    disabled={isSubmitting}
                    className="h-8 rounded-[8px] px-4 text-[11px] font-medium"
                  >
                    Payout Bonus
                  </Button>
                </div>
              </div>
            );
          })}

          {filteredData.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No pending bonuses found.
            </div>
          )}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleCloseDialog}>
        <DialogContent className="border-white/30 bg-[#5C7F3C] w-[400px]">
          <DialogHeader className="space-y-0 text-left">
            <div className="flex gap-3">
              <div className="mt-1">
                <Gift className="h-6 w-6 text-white" />
              </div>

              <div>
                <DialogTitle className="text-xl font-semibold leading-tight text-white">
                  Process Bonus
                </DialogTitle>
                <p className="mt-1 text-sm text-white/90">
                  {selected?.payeeInfo.name ? `For ${selected.payeeInfo.name}` : "Bonus payout"}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg px-4 py-3 text-white">
                <p className="text-xs font-medium text-white/90">Campaign Budget</p>
                <p className="mt-1 text-xl font-semibold">
                  {selected ? formatCurrency(selected.campaign.totalBudget) : "৳0"}
                </p>
              </div>

              <div className="bg-white/10 rounded-lg px-4 py-3 text-white">
                <p className="text-xs font-medium text-white/90">Bonus Earned Amount</p>
                <p className="mt-1 text-xl font-semibold">
                  {selected ? formatCurrency(selected.bonusAmount) : "৳0"}
                </p>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-white">
                  Payout Bonus Amount
                </p>
                <Input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 rounded-lg border-0 bg-white text-center text-2xl font-medium text-[#5C5C5C] placeholder:text-[#B8B8B8]"
                  placeholder="৳ 0"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !selected}
              className="h-12 w-full rounded-lg bg-[#F5F5E8] text-base font-medium text-[#1F1F1F] hover:bg-[#F5F5E8]/90"
            >
              {isSubmitting ? <Loader className="h-5 w-5" /> : "Provide Bonus"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

