import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Target } from "lucide-react";
import ProgressStepper from "@/app/[locale]/(brand)/brand/_components/progress-stepper";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";

type Props = {
  campaign: ClientCampaignDetails;
};

const toKey = (v?: string | null) => String(v ?? "").toLowerCase();

function buildProgressStepper(campaign: ClientCampaignDetails) {
  const status = toKey(campaign.status);
  const pay = toKey(campaign.paymentStatus);

  const isCompleted = status === "completed";
  const isPromoting =
    status === "active" || status === "promoting" || status === "in_review";

  const isPaidFull = pay === "paid";
  const isPaidPartial = pay === "partial";
  const isPaidPending = pay === "pending";

  const isQuoted =
    [
      "received",
      "negotiating",
      "quoted",
      "pending_influencer",
      "pending_agency",
      "agency_negotiating",
      "agency_accepted",
      "budget_quoting",
      "budget_building",
      "accepted",
      "approved",
    ].includes(status) ||
    isPaidPending ||
    isPaidPartial ||
    isPaidFull;

  const currentStage = (() => {
    if (isCompleted) return "completed";
    if (isPromoting) return "promoting";
    if (isPaidFull || isPaidPartial) return "paid";
    if (isQuoted) return "quoted";
    return "submitted";
  })();

  const stages = [
    {
      stage: "Submitted",
      isDone: true,
      doneLabel: "Campaign Submitted",
    },
    {
      stage: "Quoted",
      isDone:
        isQuoted || isPaidFull || isPaidPartial || isPromoting || isCompleted,
      doneLabel: "Quote Received",
    },
    {
      stage: "Paid",
      isDone: isPaidFull || isPaidPartial || isPromoting || isCompleted,
      doneLabel: isPaidPartial
        ? "Payment Partial"
        : isPaidFull
          ? "Payment Confirmed"
          : "Payment Pending",
    },
    {
      stage: "Promoting",
      isDone: isPromoting || isCompleted,
      doneLabel: "Campaign Live",
    },
    {
      stage: "Completed",
      isDone: isCompleted,
      doneLabel: "Campaign Finished",
    },
  ];

  return { currentStage, stages };
}

export default function CampaignProgressCard({ campaign }: Props) {
  const progressStepper = buildProgressStepper(campaign);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 font-semibold text-Primary">
          <Target className="h-5 w-5" />
          <p className="text-base">Campaign Progress</p>
        </div>
      </CardHeader>

      <CardContent>
        <ProgressStepper progressStepper={progressStepper} />
      </CardContent>
    </Card>
  );
}
