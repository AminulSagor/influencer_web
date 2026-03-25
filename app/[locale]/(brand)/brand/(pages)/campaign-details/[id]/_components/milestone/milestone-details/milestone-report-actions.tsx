"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import ReportAdminDialog from "./report-admin-dialog";
import SubmittedReportsDialog from "./submissions/submitted-reports-dialog";

type Props = {
  milestoneId?: string | null;
  milestoneStatus?: string | null;
  reportId?: string | null;
};

function normalizeStatus(value?: string | null) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export default function MilestoneReportActions({
  milestoneId,
  milestoneStatus,
  reportId,
}: Props) {
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportsOpen, setReportsOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const status = normalizeStatus(milestoneStatus);

  const isCompleted = status === "completed" || status === "complete";
  const isInReview = status === "in_review" || status === "in review";
  const isDeclined = status === "declined";

  const disableReportAdmin =
    !milestoneId || isCompleted || !(isInReview || isDeclined);

  const disableViewSubmittedReport = !reportId || isInReview;

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

      {reportId ? (
        <SubmittedReportsDialog
          open={reportsOpen}
          onOpenChange={setReportsOpen}
          reportId={reportId}
          refreshKey={refreshKey}
        />
      ) : null}
    </>
  );
}