"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Quote, CreditCard, Megaphone, Lock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCampaignProgress } from "@/api/admin/campaign/get-campaign-progress";

type StepperProps = { campaignId: string };

const icons = {
  check: Check,
  quote: Quote,
  card: CreditCard,
  megaphone: Megaphone,
  lock: Lock,
};

const STEPS = [
  { key: "request", title: "Request Received", subtitle: "Campaign Request Received", icon: "check" },
  { key: "quoted", title: "Quoted", subtitle: "Quote Provided", icon: "quote" },
  { key: "paid", title: "Paid", subtitle: "Payment Processed", icon: "card" },
  { key: "promoting", title: "Promoting", subtitle: "Content is Live", icon: "megaphone" },
  { key: "completed", title: "Completed", subtitle: "Campaign Finished", icon: "lock" },
] as const;

type ApiPayload = {
  success?: boolean;
  data?: {
    status?: string; // ✅ main campaign status
    paymentStatus?: string; // ✅ payment status
    currentStep?: number; // ✅ optional backend step (fallback)
  };
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const isPaid = (paymentStatus?: string) => {
  const p = (paymentStatus ?? "").toLowerCase();
  return p === "paid" || p === "success" || p === "succeeded" || p === "completed";
};

const isCancelled = (status?: string) => {
  const s = (status ?? "").toLowerCase();
  return s === "cancelled" || s === "canceled";
};

const mapStatusToStep = (status?: string) => {
  const s = (status ?? "").toLowerCase();

  // 0: request
  if (["received", "request", "requested", "pending", "pending_request"].includes(s)) return 0;

  // 1: quoted (also includes agency/invite states BEFORE payment)
  if (
    [
      "needs-quote",
      "quoted",
      "quote_sent",
      "pending_quote",
      "pending_agency",
      "pending_invitations",
      "agency_pending",
      "influencer_pending",
      "confirmed",
      "approved",
    ].includes(s)
  )
    return 1;

  // 3: promoting
  if (["active", "promoting", "live", "running"].includes(s)) return 3;

  // 4: completed
  if (["completed", "finished"].includes(s)) return 4;

  return -1; // unknown
};

const stepToPercent = (stepIndex: number) => {
  if (STEPS.length <= 1) return 0;
  return Math.round((clamp(stepIndex, 0, STEPS.length - 1) / (STEPS.length - 1)) * 100);
};

const deriveStep = (args: { status?: string; paymentStatus?: string; currentStep?: number }) => {
  const mapped = mapStatusToStep(args.status);

  if (isPaid(args.paymentStatus)) return mapped >= 3 ? mapped : 2; // at least "Paid"
  if (mapped >= 0) return mapped;

  // fallback to backend currentStep (often 1-based); unpaid must not pass quoted
  if (typeof args.currentStep === "number") {
    const zeroBased = args.currentStep >= 1 ? args.currentStep - 1 : args.currentStep;
    return clamp(zeroBased, 0, 1);
  }

  return 0;
};

export default function CampaignStepper({ campaignId }: StepperProps) {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<{ status: string; paymentStatus: string; currentStep?: number } | null>(null);

  useEffect(() => {
    if (!campaignId) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res: ApiPayload = await getCampaignProgress(campaignId);
        const d = res?.data ?? {};

        if (!alive) return;

        setState({
          status: String(d.status ?? ""),
          paymentStatus: String(d.paymentStatus ?? ""),
          currentStep: typeof d.currentStep === "number" ? d.currentStep : undefined,
        });
      } catch {
        if (!alive) return;
        setState(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [campaignId]);

  const status = state?.status ?? "";
  const paymentStatus = state?.paymentStatus ?? "";
  const paid = useMemo(() => isPaid(paymentStatus), [paymentStatus]);
  const cancelled = useMemo(() => isCancelled(status), [status]);

  const currentStep = useMemo(
    () => deriveStep({ status, paymentStatus, currentStep: state?.currentStep }),
    [status, paymentStatus, state?.currentStep]
  );

  const progressPercent = useMemo(() => stepToPercent(currentStep), [currentStep]);

  if (loading) return <div className="rounded-xl border bg-white p-6">Loading...</div>;

  return (
    <div className="rounded-xl border bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className={cn("flex items-center gap-2 font-semibold", cancelled ? "text-red-600" : "text-light-green-700")}>
          {cancelled ? <XCircle className="h-5 w-5" /> : <Check className="h-5 w-5" />}
          Campaign Progress
        </h3>

        <p className="text-sm">
          Overall Progress <span className="font-semibold text-orange-500">{progressPercent}% Completed</span>
          {cancelled && <span className="ml-2 font-semibold text-red-600">Cancelled</span>}
        </p>
      </div>

      {/* Stepper */}
      <div className="relative flex items-center justify-between">
        {/* Line */}
        <div className="absolute left-0 right-0 top-6 h-[2px] bg-gray-200">
          <div
            className={cn("h-full transition-all", cancelled ? "bg-red-600" : "bg-light-green-700")}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {STEPS.map((step, index) => {
          const Icon = icons[step.icon as keyof typeof icons];

          // Base completion
          const baseCompleted = index <= currentStep;

          // Paid step completion depends ONLY on paymentStatus
          const completed = step.key === "paid" ? paid : baseCompleted;

          // Active ring; avoid highlighting Paid if unpaid
          const active = step.key === "paid" ? paid && index === currentStep : index === currentStep;

          return (
            <div key={step.key} className="relative z-10 flex w-full flex-col items-center text-center">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white",
                  completed
                    ? cancelled
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-light-green-700 bg-light-green-700 text-white"
                    : "border-gray-300 text-gray-400",
                  active && (cancelled ? "ring-4 ring-red-100" : "ring-4 ring-green-100")
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <p className="mt-3 text-sm font-medium">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.subtitle}</p>

              {step.key === "paid" && (
                <p className={cn("mt-1 text-[11px]", paid ? "text-light-green-700" : "text-gray-400")}>
                  {paid ? "Paid" : `Payment: ${paymentStatus || "pending"}`}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}