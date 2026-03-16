"use client";

import {
  Check,
  Quote,
  CreditCard,
  Megaphone,
  Lock,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StepperProps = {
  status?: string | null;
  paymentStatus?: string | null;
};

const icons = {
  check: Check,
  quote: Quote,
  card: CreditCard,
  megaphone: Megaphone,
  lock: Lock,
};

type StepKey = "request" | "quoted" | "paid" | "promoting" | "completed";
type StepIconKey = "check" | "quote" | "card" | "megaphone" | "lock";

type StepItem = {
  key: StepKey;
  title: string;
  subtitle: string;
  icon: StepIconKey;
};

const STEPS: StepItem[] = [
  {
    key: "request",
    title: "Request Received",
    subtitle: "Campaign Request Received",
    icon: "check",
  },
  {
    key: "quoted",
    title: "Quoted",
    subtitle: "Quote Provided",
    icon: "quote",
  },
  {
    key: "paid",
    title: "Paid",
    subtitle: "Payment Processed",
    icon: "card",
  },
  {
    key: "promoting",
    title: "Promoting",
    subtitle: "Content is Live",
    icon: "megaphone",
  },
  {
    key: "completed",
    title: "Completed",
    subtitle: "Campaign Finished",
    icon: "lock",
  },
];

function normalizeStatus(value?: string | null) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizePaymentStatus(value?: string | null) {
  return String(value ?? "").trim().toLowerCase();
}

function isDeclined(status?: string | null) {
  return normalizeStatus(status) === "declined";
}

function getQuotedStatuses() {
  return [
    "negotiating",
    "pending_influencer",
    "pending_agency",
    "agency_negotiating",
    "agency_accepted",
  ];
}

function mapStatusToStep(status?: string | null) {
  const s = normalizeStatus(status);

  if (s === "completed") return 4;
  if (s === "active") return 3;
  if (getQuotedStatuses().includes(s)) return 1;
  if (s === "received") return 0;
  if (s === "declined") return 0;

  return 0;
}

function getPaymentMeta(paymentStatus?: string | null) {
  const p = normalizePaymentStatus(paymentStatus);

  if (p === "partial") {
    return {
      isPaid: true,
      title: "Paid (Partially)",
      note: "Payment: partial",
    };
  }

  if (p === "full") {
    return {
      isPaid: true,
      title: "Paid",
      note: "Payment: full",
    };
  }

  return {
    isPaid: false,
    title: "Paid",
    note: "Payment: pending",
  };
}

function isPaidStep(step: StepItem) {
  return step.key === "paid";
}

export default function CampaignStepper({
  status,
  paymentStatus,
}: StepperProps) {
  const declined = isDeclined(status);
  const currentStep = mapStatusToStep(status);
  const paymentMeta = getPaymentMeta(paymentStatus);

  const progressPercent = (() => {
    let doneCount = 0;

    for (const step of STEPS) {
      if (step.key === "request" && currentStep >= 0) doneCount++;
      if (step.key === "quoted" && currentStep >= 1) doneCount++;
      if (step.key === "paid" && paymentMeta.isPaid) doneCount++;
      if (step.key === "promoting" && currentStep >= 3) doneCount++;
      if (step.key === "completed" && currentStep >= 4) doneCount++;
    }

    return Math.round((doneCount / STEPS.length) * 100);
  })();

  return (
    <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3
          className={cn(
            "flex items-center gap-3 text-[18px] font-semibold",
            declined ? "text-red-600" : "text-[#35571C]"
          )}
        >
          {declined ? (
            <XCircle className="h-6 w-6" />
          ) : (
            <Check className="h-6 w-6" />
          )}
          Campaign Progress
        </h3>

        <p className="text-sm md:text-base">
          <span className="text-[#111827]">Overall Progress </span>
          <span className="font-semibold text-[#F28C28]">
            {progressPercent}% Completed
          </span>
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-[4%] right-[4%] top-6 h-[2px] bg-[#D9DDE3]" />

        <div className="relative grid grid-cols-5 gap-2 md:gap-4">
          {STEPS.map((step, index) => {
            const Icon = icons[step.icon];

            const completed = isPaidStep(step)
              ? paymentMeta.isPaid
              : step.key === "request"
                ? currentStep >= 0
                : step.key === "quoted"
                  ? currentStep >= 1
                  : step.key === "promoting"
                    ? currentStep >= 3
                    : step.key === "completed"
                      ? currentStep >= 4
                      : false;

            const active = !completed &&
              (step.key === "quoted"
                ? currentStep === 1
                : step.key === "paid"
                  ? currentStep >= 1 && !paymentMeta.isPaid
                  : step.key === "promoting"
                    ? currentStep === 3
                    : step.key === "completed"
                      ? currentStep === 4
                      : currentStep === index);

            const iconClass = completed
              ? declined
                ? "border-red-600 bg-red-600 text-white"
                : "border-[#35571C] bg-[#35571C] text-white"
              : active
                ? "border-[#CFEAD7] bg-white text-[#9CA3AF] ring-4 ring-[#E4F5E8]"
                : "border-[#D1D5DB] bg-white text-[#9CA3AF]";

            const title = isPaidStep(step) ? paymentMeta.title : step.title;

            return (
              <div
                key={step.key}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all md:h-14 md:w-14",
                    iconClass
                  )}
                >
                  {completed && step.key === "request" ? (
                    <Check
                      className="h-5 w-5 md:h-6 md:w-6"
                      strokeWidth={2.8}
                    />
                  ) : (
                    <Icon
                      className="h-5 w-5 md:h-6 md:w-6"
                      strokeWidth={2.3}
                    />
                  )}
                </div>

                <p className="mt-3 text-sm font-semibold text-[#111827] md:text-[18px]">
                  {title}
                </p>

                <p className="text-[11px] text-[#6B7280] md:text-[14px]">
                  {step.subtitle}
                </p>

                {isPaidStep(step) && (
                  <p className="mt-1 text-[11px] text-[#94A3B8] md:text-[14px]">
                    {paymentMeta.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}