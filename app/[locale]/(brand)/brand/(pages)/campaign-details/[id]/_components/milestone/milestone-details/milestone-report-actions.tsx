"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import ReportAdminDialog from "./report-admin-dialog";
import SubmittedReportsDialog from "./submissions/submitted-reports-dialog";

type Props = {
  milestoneId?: string | null;
  milestoneStatus?: string | null;
};

function normalizeStatus(value?: string | null) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export default function MilestoneReportActions({
  milestoneId,
  milestoneStatus,
}: Props) {
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportsOpen, setReportsOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const status = normalizeStatus(milestoneStatus);

  const isPending = status === "pending";
  const isCompleted =
    status === "completed" || status === "completed_plus_plus";
  const isInReview = status === "in_review" || status === "in_progress";
  const isTodo = status === "todo";

  const disableReportAdmin = !milestoneId || isPending || isCompleted || isTodo;
  const disableViewSubmittedReport =
    !milestoneId || isPending || isInReview || isTodo;

  return (
    <>
      <div className="flex w-full flex-col justify-center gap-2 sm:gap-2.5">
        <Button
          type="button"
          onClick={() => {
            if (!disableReportAdmin) setReportOpen(true);
          }}
          disabled={disableReportAdmin}
          className="h-10 rounded-[12px] bg-[#6D8F47] px-4 text-xs font-medium text-white hover:bg-[#628141] disabled:bg-[#F1F1F1] disabled:text-[#BDBDBD] sm:h-11 sm:text-sm"
        >
          Report Admin
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!disableViewSubmittedReport) setReportsOpen(true);
          }}
          disabled={disableViewSubmittedReport}
          className="h-10 rounded-[12px] border border-[#D5D5D5] bg-[#FAFAFA] px-4 text-xs font-medium text-[#2E5B1F] hover:bg-[#FAFAFA] disabled:bg-[#F3F3F3] disabled:text-[#BDBDBD] sm:h-11 sm:text-sm"
        >
          View Submitted Report
        </Button>
      </div>

      {milestoneId ? (
        <ReportAdminDialog
          open={reportOpen}
          onOpenChange={setReportOpen}
          milestoneId={milestoneId}
          onSubmitted={() => setRefreshKey((prev) => prev + 1)}
        />
      ) : null}

      {milestoneId ? (
        <SubmittedReportsDialog
          open={reportsOpen}
          onOpenChange={setReportsOpen}
          milestoneId={milestoneId}
          refreshKey={refreshKey}
        />
      ) : null}
    </>
  );
}
