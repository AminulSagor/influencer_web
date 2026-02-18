"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Quote, CreditCard, Megaphone, Lock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ use YOUR api (change this import path to where you wrote it)
import { getCampaignProgress } from "@/api/admin/campaign/get-campaign-progress";

type StepperProps = {
  campaignId: string; // ✅ now it will fetch dynamically
};

const icons = {
  check: Check,
  quote: Quote,
  card: CreditCard,
  megaphone: Megaphone,
  lock: Lock,
};

const steps = [
  { key: "request", title: "Request Received", subtitle: "Campaign Request Received", icon: "check" },
  { key: "quoted", title: "Quoted", subtitle: "Quote Provided", icon: "quote" },
  { key: "paid", title: "Paid", subtitle: "Payment Processed", icon: "card" },
  { key: "promoting", title: "Promoting", subtitle: "Content is Live", icon: "megaphone" },
  { key: "completed", title: "Completed", subtitle: "Campaign Finished", icon: "lock" },
];

function parsePercent(p?: string) {
  const n = Number(String(p ?? "0").replace("%", "").trim());
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
}

// ✅ adjust mapping if your backend uses different words
function mapStatusToStep(status?: string) {
  const s = (status ?? "").toLowerCase();

  if (s === "received" || s === "request" || s === "requested") return 0;
  if (s === "quoted" || s === "needs-quote") return 1;
  if (s === "paid") return 2;
  if (s === "active" || s === "promoting" || s === "live") return 3;
  if (s === "completed") return 4;

  // cancelled / unknown -> show 0th step
  return 0;
}

export default function CampaignStepper({ campaignId }: StepperProps) {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<{
    campaignStatus: string;
    operationalProgress: string;
  } | null>(null);

  useEffect(() => {
    if (!campaignId) return;

    (async () => {
      try {
        setLoading(true);

        // ✅ API CALL
        // expected response shape:
        // { success:true, message:"...", data:{ campaignStatus:"cancelled", operationalProgress:"0%", ... } }
        const res = await getCampaignProgress(campaignId);

        const data =  res.data;
        console.log(res);
        setProgressData({
          campaignStatus: data?.campaignStatus ?? "",
          operationalProgress: data?.operationalProgress ?? "0%",
        });
      } catch (e) {
        setProgressData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [campaignId]);

  const campaignStatus = progressData?.campaignStatus ?? "";
  const isCancelled = campaignStatus.toLowerCase() === "cancelled";

  const currentStep = useMemo(() => mapStatusToStep(campaignStatus), [campaignStatus]);
  const progressPercent = useMemo(
    () => parsePercent(progressData?.operationalProgress),
    [progressData?.operationalProgress]
  );

  if (loading) return <div className="rounded-xl border bg-white p-6">Loading...</div>;

  return (
    <div className="rounded-xl border bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className={cn("flex items-center gap-2 font-semibold", isCancelled ? "text-red-600" : "text-green-700")}>
          {isCancelled ? <XCircle className="h-5 w-5" /> : <Check className="h-5 w-5" />}
          Campaign Progress
        </h3>

        <p className="text-sm">
          Overall Progress{" "}
          <span className="font-semibold text-orange-500">{progressPercent}% Completed</span>
          {isCancelled && <span className="ml-2 font-semibold text-red-600">Cancelled</span>}
        </p>
      </div>

      {/* Stepper */}
      <div className="relative flex items-center justify-between">
        {/* Line */}
        <div className="absolute left-0 right-0 top-6 h-[2px] bg-gray-200">
          <div
            className={cn("h-full transition-all", isCancelled ? "bg-red-600" : "bg-green-700")}
            style={{ width: `${progressPercent}%` }} // ✅ real backend percent
          />
        </div>

        {steps.map((step, index) => {
          const Icon = icons[step.icon as keyof typeof icons];

          // if cancelled, we can still show previous completed step logic, but keep it neutral
          const isCompleted = index <= currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={step.key}
              className="relative z-10 flex w-full flex-col items-center text-center"
            >
              {/* Circle */}
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white",
                  isCompleted
                    ? isCancelled
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-green-700 bg-green-700 text-white"
                    : "border-gray-300 text-gray-400",
                  isActive && (isCancelled ? "ring-4 ring-red-100" : "ring-4 ring-green-100")
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Text */}
              <p className="mt-3 text-sm font-medium">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.subtitle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
