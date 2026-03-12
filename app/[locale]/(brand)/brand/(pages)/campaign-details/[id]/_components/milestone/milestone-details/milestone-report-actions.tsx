"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import ReportAdminDialog from "./report-admin-dialog";
import SubmittedReportsDialog from "./submitted-reports-dialog";

type Props = {
  submissionId?: string | null;
};

export default function MilestoneReportActions({ submissionId }: Props) {
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportsOpen, setReportsOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const hasSubmission = Boolean(submissionId);

  return (
    <>
      <div className="flex w-full flex-col justify-center gap-2 sm:gap-2.5">
        <Button
          type="button"
          onClick={() => hasSubmission && setReportOpen(true)}
          disabled={!hasSubmission}
          className="h-10 rounded-[12px] bg-[#6D8F47] px-4 text-xs font-medium text-white hover:bg-[#628141] disabled:bg-[#F1F1F1] disabled:text-[#BDBDBD] sm:h-11 sm:text-sm"
        >
          Report Admin
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => hasSubmission && setReportsOpen(true)}
          disabled={!hasSubmission}
          className="h-10 rounded-[12px] border border-[#D5D5D5] bg-[#FAFAFA] px-4 text-xs font-medium text-[#2E5B1F] hover:bg-[#FAFAFA] disabled:bg-[#F3F3F3] disabled:text-[#BDBDBD] sm:h-11 sm:text-sm"
        >
          View Submitted Report
        </Button>
      </div>

      {submissionId ? (
        <>
          <ReportAdminDialog
            open={reportOpen}
            onOpenChange={setReportOpen}
            submissionId={submissionId}
            onSubmitted={() => setRefreshKey((prev) => prev + 1)}
          />

          <SubmittedReportsDialog
            open={reportsOpen}
            onOpenChange={setReportsOpen}
            submissionId={submissionId}
            refreshKey={refreshKey}
          />
        </>
      ) : null}
    </>
  );
}