"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { campaignBidsService } from "@/service/client/campaigns/campaign-bids.service";
import { CampaignBid } from "@/types/client/campaigns/campaign-bids.types";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: ClientCampaignDetails;
  bid: CampaignBid | null;
  onSuccess?: () => void;
};

type PaymentPreset = "full" | "min" | "custom75" | null;

const toNumber = (value?: string | number | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatBDT = (value: number) => `৳ ${value.toLocaleString("en-US")}`;

const clampAmount = (value: number, max: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), Math.max(max, 0));
};

const parseNumericInput = (raw: string) => {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};

export default function SelectAgencyDialog({
  open,
  onOpenChange,
  campaign,
  bid,
  onSuccess,
}: Props) {
  const [payAmount, setPayAmount] = React.useState(0);
  const [activePreset, setActivePreset] = React.useState<PaymentPreset>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const totalDue = toNumber(
    campaign.paymentInfo?.dueAmount ?? campaign.dueAmount,
  );
  const minimumDue = Math.round(totalDue * 0.5);

  React.useEffect(() => {
    if (!open) return;
    setPayAmount(totalDue);
    setActivePreset("full");
  }, [open, totalDue]);

  const handlePreset = (value: number, preset: PaymentPreset) => {
    setActivePreset(preset);
    setPayAmount(clampAmount(value, totalDue));
  };

  const handleAmountInput = (raw: string) => {
    setActivePreset(null);
    setPayAmount(clampAmount(parseNumericInput(raw), totalDue));
  };

  const handleAccept = async () => {
    if (!bid) return;

    try {
      setIsSubmitting(true);

      await campaignBidsService.selectAgency({
        campaignId: campaign.id,
        agencyId: bid.agencyId,
      });

      onOpenChange(false);
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-center text-base font-semibold text-Primary">
            Fund Your Campaign
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-2xl bg-[#6D8F47] px-5 py-5 text-white">
            <p className="text-center text-sm font-medium">
              {campaign.campaignName}
            </p>

            <div className="mt-4 text-center">
              <p className="text-sm text-white/90">Total Due</p>
              <p className="mt-1 text-base font-semibold">
                {formatBDT(totalDue)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#F0A254] bg-[#FCE7D2] px-5 py-4 text-center">
            <p className="text-sm text-[#D8781E]">
              Minimum Fund Needed To Start The Campaign (50%)
            </p>
            <p className="mt-2 text-base font-semibold text-[#D8781E]">
              {formatBDT(minimumDue)}
            </p>
          </div>

          <Input
            value={payAmount ? payAmount.toLocaleString("en-US") : ""}
            onChange={(e) => handleAmountInput(e.target.value)}
            inputMode="numeric"
            placeholder="0"
            className="h-12 text-center text-base"
          />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handlePreset(totalDue, "full")}
              className="rounded-full text-sm"
            >
              Pay In Full (100%)
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handlePreset(minimumDue, "min")}
              className="rounded-full text-sm"
            >
              Pay Minimum (50%)
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                handlePreset(Math.round(totalDue * 0.75), "custom75")
              }
              className="rounded-full text-sm"
            >
              Pay (75%)
            </Button>
          </div>

          <div>
            <p className="text-base font-semibold text-Primary">
              Payment Method
            </p>
            <button
              type="button"
              className="mt-3 flex h-12 w-full items-center justify-between rounded-[14px] border border-light-gray bg-white px-4 text-sm text-Primary"
            >
              <span>Credit / Debit Card</span>
              <span>▾</span>
            </button>
          </div>

          <Button
            type="button"
            onClick={handleAccept}
            disabled={!bid || payAmount <= 0 || isSubmitting}
            className="h-12 w-full text-sm"
          >
            {isSubmitting ? "Processing..." : "Accept & Pay"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
