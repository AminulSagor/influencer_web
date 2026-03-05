import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Target } from "lucide-react";
import type { Campaignservice } from "@/app/[locale]/(brand)/brand/types/client-types";
import ProgressStepper from "@/app/[locale]/(brand)/brand/_components/progress-stepper";

type Props = {
  campaign: Campaignservice;
};

const toKey = (v?: string | null) => String(v ?? "").toLowerCase();

function buildProgressStepper(campaign: Campaignservice) {
  const status = toKey(campaign.status);
  const pay = toKey(campaign.paymentStatus);

  const isCompleted = status === "completed";
  const isPromoting = status === "active"; // your rule
  const isPaidFull = pay === "full";
  const isPaidPartial = pay === "partial";

  const isQuoted =
    ["pending_influencer", "pending_agency", "agency_negotiating", "agency_accepted"].includes(status) ||
    status === "negotiating" ||
    status === "received";

  const currentStage = (() => {
    if (isCompleted) return "completed";
    if (isPromoting) return "promoting";
    if (isPaidFull || isPaidPartial) return "paid";
    if (isQuoted) return "quoted";
    return "submitted";
  })();

  const stages = [
    { stage: "Submitted", isDone: true, doneLabel: "Campaign Submitted" },
    { stage: "Quoted", isDone: isQuoted || isPaidFull || isPaidPartial || isPromoting || isCompleted, doneLabel: "Quote Received" },
    {
      stage: "Paid",
      isDone: isPaidFull || isPaidPartial || isPromoting || isCompleted,
      doneLabel: isPaidPartial ? "Payment Partial" : isPaidFull ? "Payment Confirmed" : "Payment Pending",
    },
    { stage: "Promoting", isDone: isPromoting || isCompleted, doneLabel: "Campaign Live" },
    { stage: "Completed", isDone: isCompleted, doneLabel: "Campaign Finished" },
  ];

  return { currentStage, stages };
}

export default function CampaignProgressCard({ campaign }: Props) {
  const progressStepper = buildProgressStepper(campaign);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 text-Primary font-semibold">
          <Target />
          <p>Campaign Progress</p>
        </div>
      </CardHeader>

      <CardContent>
        <ProgressStepper progressStepper={progressStepper} />
      </CardContent>
    </Card>
  );
}
