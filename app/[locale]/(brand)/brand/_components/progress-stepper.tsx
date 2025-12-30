import React from "react";
import {
  Check,
  Quote,
  ReceiptText,
  Megaphone,
  Lock,
  Circle,
} from "lucide-react";

type StepperStatus = "done" | "current" | "todo";

type ProgressStepperData = {
  currentStage: string; // allow CampaignStage too via string (it will be compatible)
  stages: Array<{
    stage: string; // allow CampaignStage (it extends string in TS unions)
    isDone: boolean;
    doneLabel?: string; // ✅ optional
  }>;
};

type ProgressStepperProps = {
  progressStepper?: ProgressStepperData;
};

const iconByStage = (stage: string) => {
  const key = stage.toLowerCase();
  if (key === "submitted") return <Check className="h-5 w-5" />;
  if (key === "quoted") return <Quote className="h-5 w-5" />;
  if (key === "paid") return <ReceiptText className="h-5 w-5" />;
  if (key === "promoting") return <Megaphone className="h-5 w-5" />;
  if (key === "completed") return <Lock className="h-5 w-5" />;
  return <Circle className="h-5 w-5" />;
};

const getStatus = (
  i: number,
  currentIndex: number,
  isDone: boolean
): StepperStatus => {
  if (isDone) return "done";
  if (i === currentIndex) return "current";
  if (i < currentIndex) return "done";
  return "todo";
};

const StepIcon = ({
  status,
  children,
}: {
  status: StepperStatus;
  children: React.ReactNode;
}) => {
  const base =
    "h-10 w-10 rounded-full flex items-center justify-center border transition-colors";

  if (status === "done" || status === "current") {
    return (
      <div className={`${base} bg-Primary border-Primary text-white`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`${base} bg-white border-black/15 text-black/35`}>
      {children}
    </div>
  );
};

const ProgressStepper = ({ progressStepper }: ProgressStepperProps) => {
  const stages = progressStepper?.stages ?? [];
  const stepsCount = stages.length;

  if (!stepsCount) return null;

  const currentIndexRaw = stages.findIndex(
    (s) =>
      String(s.stage).toLowerCase() ===
      String(progressStepper?.currentStage ?? "").toLowerCase()
  );
  const currentIndex = currentIndexRaw >= 0 ? currentIndexRaw : 0;

  const lastDoneIndex = (() => {
    const last = stages
      .map((s, i) => (s.isDone ? i : -1))
      .filter((i) => i >= 0);
    return last.length ? last[last.length - 1] : currentIndex;
  })();

  const progressPct =
    stepsCount <= 1 ? 0 : (lastDoneIndex / (stepsCount - 1)) * 100;

  const edgeOffsetPct = 100 / (stepsCount * 2);

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="relative min-w-[720px]">
        {/* Track */}
        <div
          className="absolute top-5 h-[2px] bg-black/10"
          style={{
            left: `${edgeOffsetPct}%`,
            right: `${edgeOffsetPct}%`,
          }}
        >
          <div
            className="h-full bg-Primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Steps */}
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: `repeat(${stepsCount}, minmax(0, 1fr))`,
          }}
        >
          {stages.map((s, i) => {
            const status = getStatus(i, currentIndex, s.isDone);

            return (
              <div
                key={`${String(s.stage)}-${i}`}
                className="flex flex-col items-center text-center"
              >
                <StepIcon status={status}>{iconByStage(String(s.stage))}</StepIcon>

                <div className="mt-3">
                  <p
                    className={`text-sm font-semibold ${
                      status === "todo" ? "text-black/45" : "text-black/80"
                    }`}
                  >
                    {String(s.stage)}
                  </p>

                  <p className="mt-0.5 text-[11px] text-black/40">
                    {s.doneLabel ?? "—"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper;
