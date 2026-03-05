"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { IoCheckmarkCircle } from "react-icons/io5";
import { PiInstagramLogoFill, PiYoutubeLogoFill } from "react-icons/pi";
import { AiFillTikTok } from "react-icons/ai";

import QuoteTextRow from "./quote-text-row";
import type { Platform } from "./campaign-details-card";

import { sendCampaignQuote } from "@/service/admin/campaign/send-campaign-quote";
import { notifyError, notifySuccess } from "@/utils/toast_util";

type QuoteState = "none" | "sent" | "confirmed";

type Props = {
  campaignId: string;

  // ✅ backend-driven state
  quoteState?: QuoteState;

  // ✅ refresh parent after sending so reload stays correct
  onRefresh?: () => Promise<void> | void;

  title?: string;
  revisedCount: number;
  currencySymbol?: string;
  className?: string;
  platform?: Platform[];

  clientBudget: number;
  vatAmount: number;
  totalBudget: number;
  netPayableAmount: number;

  campaignName?: string;
  clientName?: string;
};

const money = (n: number) => {
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toLocaleString("en-US");
};

export default function CampaignQuoteDetails({
  campaignId,
  quoteState = "none",
  onRefresh,

  title = "Quote Details",
  revisedCount,
  currencySymbol = "৳",
  className,
  platform,

  clientBudget,
  vatAmount,
  totalBudget,
  netPayableAmount,

  campaignName,
  clientName,
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const [localQuoteState, setLocalQuoteState] = useState<QuoteState>(quoteState);

  const [quoteAmount, setQuoteAmount] = useState<number>(Number(netPayableAmount ?? 0));

  useEffect(() => {
    setQuoteAmount(Number(netPayableAmount ?? 0));
  }, [netPayableAmount]);

  useEffect(() => {
    setLocalQuoteState(quoteState);
  }, [quoteState]);

  const vatPercent = useMemo(() => {
    if (!clientBudget) return 0;
    return Math.round((vatAmount / clientBudget) * 100);
  }, [clientBudget, vatAmount]);

  const PLATFORM_ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
    instagram: PiInstagramLogoFill,
    youtube: PiYoutubeLogoFill,
    tiktok: AiFillTikTok,
  };

  const isLocked = localQuoteState !== "none";

  const buttonText =
    localQuoteState === "confirmed"
      ? "Quotation Confirmed"
      : localQuoteState === "sent"
        ? "Quotation Sent"
        : "Send Quote";

const handleSendQuoteClick = async () => {
  try {
    setSending(true);

    await sendCampaignQuote({
      campaignId,
      proposedBaseBudget: Number(quoteAmount ?? 0),
    });

    notifySuccess("Quotation sent successfully");

    setLocalQuoteState("sent");
    setIsDialogOpen(true);

    await onRefresh?.();
  } catch (e: any) {
    console.error("❌ send quote failed:", e);

    if (e?.response?.status === 409) {
      notifyError("Quotation already sent");
      setLocalQuoteState("sent");
    } else {
      notifyError("Failed to send quotation");
    }
  } finally {
    setSending(false);
  }
};

  return (
    <>
      <Card className={cn("rounded-2xl border border-[rgba(100,116,139,0.14)]", className)}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-Primary text-lg">{title}</CardTitle>
            <p className="text-gray-400 text-sm">Revised: {revisedCount} Times</p>
          </div>

          <div className="w-10 aspect-square rounded-full bg-Secondary flex items-center justify-center text-Primary font-semibold text-xl">
            {currencySymbol}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <QuoteTextRow text="Base Campaign Bugdet" amount={clientBudget} />
            <QuoteTextRow text="Vat/Tax" vat={vatPercent} amount={vatAmount} />
          </div>

          <Separator />

          <div className="space-y-3">
            <QuoteTextRow text="Total Campaign Cost" amount={totalBudget} />

            <div className="flex items-center gap-6">
              <p className="whitespace-nowrap">Quote Amount</p>

              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">
                  {currencySymbol}
                </span>

                <Input
                  type="number"
                  min={0}
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(Number(e.target.value || 0))}
                  className="pl-7 text-right font-semibold"
                  disabled={isLocked}
                />
              </div>
            </div>
          </div>

          {localQuoteState === "none" ? (
            <Button
              className="w-full"
              variant={"lightGreen"}
              onClick={handleSendQuoteClick}
              disabled={sending}
            >
              {sending ? "Sending..." : buttonText}
            </Button>
          ) : (
            <Button className="w-full" variant={"outline"} disabled>
              {buttonText}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Popup */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[420px] rounded-2xl p-0 overflow-hidden">
          <div className="relative bg-white p-8 text-center">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex flex-col items-center gap-2">
              <IoCheckmarkCircle size={64} className="text-light-green" />
              <DialogTitle className="text-Primary text-xl font-semibold">
                Quotation Sent
                <br />
                To Client
              </DialogTitle>
            </div>

            <div className="mt-3 text-sm text-gray-500">
              <p>
                Quotation Amount:{" "}
                <span className="font-semibold text-Primary">
                  {currencySymbol}
                  {money(quoteAmount)}
                </span>
              </p>
              <p>Revised: {revisedCount} Times</p>
            </div>

            <div className="mt-6 rounded-xl bg-linear-to-r from-Primary to-light-green p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                  <div className="w-6 aspect-square relative">
                    <Image src={"/icons/online-ads-icon.svg"} fill alt="icon" />
                  </div>
                </div>

                <div className="text-white-two">
                  <p className="text-base font-semibold">{campaignName ?? "-"}</p>
                  <p className="text-2xl font-bold">
                    {currencySymbol}
                    {money(totalBudget)}
                  </p>
                </div>
              </div>

              <Separator className="my-4 bg-white/20" />

              <div className="flex items-center justify-between text-white-two">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Platforms</span>
                  <div className="flex items-center gap-1">
                    {platform?.map((plat, idx) => {
                      const Icon = PLATFORM_ICON_MAP[String(plat.key ?? "").toLowerCase()];
                      if (!Icon) return null;
                      return (
                        <span key={`${plat.key || "p"}-${idx}`} className="text-white-two">
                          <Icon size={18} />
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="text-sm">
                  Client: <span className="font-semibold">{clientName ?? "-"}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
