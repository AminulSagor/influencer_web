"use client";

import { cn } from "@/lib/utils";
import type { InfluencerVerificationStatus } from "@/types/admin/user/influencer-verification-profile_type";

type Props = {
  nichesCount: number;
  socialLinksCount: number;
  nidStatus?: InfluencerVerificationStatus;
  payoutsCount: number;
  emailVerified?: boolean;
};

function StepDot({ done }: { done: boolean }) {
  return (
    <div
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full",
        done ? "bg-Primary text-white" : "bg-off-white text-light-gray"
      )}
    >
      {done ? "✓" : "⏳"}
    </div>
  );
}

function StepItem({
  label,
  sub,
  done,
}: {
  label: string;
  sub: string;
  done: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <StepDot done={done} />
      <div className="text-sm font-semibold text-black">{label}</div>
      <div className="text-xs text-light-gray">{sub}</div>
    </div>
  );
}

export default function ApprovalProgressCard({
  nichesCount,
  socialLinksCount,
  nidStatus,
  payoutsCount,
  emailVerified,
}: Props) {
  const doneNiches = nichesCount > 0;
  const doneSocial = socialLinksCount > 0;
  const doneNid = nidStatus === "approved";
  const donePayout = payoutsCount > 0;
  const doneEmail = Boolean(emailVerified);

  const total = 5;
  const doneCount = [doneNiches, doneSocial, doneNid, donePayout, doneEmail].filter(
    Boolean
  ).length;

  const overall = Math.round((doneCount / total) * 100);
  const pending = overall < 100;

  return (
    <div className="rounded-xl border border-primary/15 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-Primary/10 text-Primary">
            ⟳
          </div>
          <h3 className="text-lg font-semibold text-black">Approval Progress</h3>
        </div>

        <div className="text-sm text-light-gray">
          Overall Progress{" "}
          <span className={cn("ml-2 font-semibold", pending ? "text-orange" : "text-light-green")}>
            {overall}% {pending ? "Pending" : "Approved"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <StepItem label="Niches" sub={`${nichesCount} Selected`} done={doneNiches} />
        <div className="h-px flex-1 bg-Primary/15" />
        <StepItem
          label="Social Links"
          sub={`${socialLinksCount} Added`}
          done={doneSocial}
        />
        <div className="h-px flex-1 bg-Primary/15" />
        <StepItem label="NID" sub={nidStatus ? nidStatus : "pending"} done={doneNid} />
        <div className="h-px flex-1 bg-Primary/15" />
        <StepItem
          label="Payment Setup"
          sub={payoutsCount ? `${payoutsCount} Added` : "Pending"}
          done={donePayout}
        />
        <div className="h-px flex-1 bg-Primary/15" />
        <StepItem label="Email" sub={doneEmail ? "Verified" : "Pending"} done={doneEmail} />
      </div>

      <div className="mt-6 rounded-xl border border-primary/15 bg-off-white p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-black">
            Approve With Current Progress!
          </div>

          <div className="flex items-center gap-3">
            <button className="h-10 rounded-md border border-medium-gray/40 bg-white px-6 text-sm font-medium text-black hover:bg-off-white active:scale-[0.98]">
              Reject
            </button>
            <button className="h-10 rounded-md bg-Primary px-6 text-sm font-medium text-white hover:brightness-95 active:scale-[0.98]">
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}